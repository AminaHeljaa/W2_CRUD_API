
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const cheerio = require("cheerio");
const { z } = require("zod");

const BASE_URL = "https://books.toscrape.com/";
const USER_AGENT = "AminaEducationalScraper/1.0";
const TIMEOUT_MS = 10000;
const REQUEST_DELAY_MS = 600;
const MAX_PAGES = 3;

const ROOT_DIR = path.join(__dirname, "..");
const CACHE_DIR = path.join(ROOT_DIR, "cache");
const OUTPUT_DIR = path.join(ROOT_DIR, "output");

const stats = {
    pages_fetched: 0,
    cache_hits: 0,
    failed_pages: []
};

const BookSchema = z.object({
    title: z.string().min(1),
    product_url: z.string().url(),
    price_text: z.string().min(1),
    price_gbp: z.number().nonnegative(),
    availability_text: z.string().min(1),
    rating_text: z.string().min(1),
    description: z.string().nullable(),
    source_page: z.number().int().min(1).max(3),
    fetched_at: z.string().datetime()
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getCacheFile(url) {
    const parsedUrl = new URL(url);

    if (parsedUrl.pathname === "/") {
        return path.join(CACHE_DIR, "catalogue-page-1.html");
    }

    const catalogueMatch = parsedUrl.pathname.match(
        /\/catalogue\/page-(\d+)\.html$/
    );

    if (catalogueMatch) {
        return path.join(
            CACHE_DIR,
            `catalogue-page-${catalogueMatch[1]}.html`
        );
    }

    const hash = crypto
        .createHash("sha256")
        .update(url)
        .digest("hex")
        .slice(0, 16);

    return path.join(CACHE_DIR, `book-${hash}.html`);
}

async function fetchPage(url) {
    await fs.mkdir(CACHE_DIR, { recursive: true });

    const cacheFile = getCacheFile(url);

    try {
        const html = await fs.readFile(cacheFile, "utf8");

        stats.cache_hits++;
        console.log(`CACHE HIT: ${path.basename(cacheFile)}`);

        return html;
    } catch (error) {
        if (error.code !== "ENOENT") {
            throw error;
        }
    }

    // Prvi pokušaj i eventualni jedan ponovljeni pokušaj.
    for (let attempt = 1; attempt <= 2; attempt++) {
        await sleep(REQUEST_DELAY_MS);

        const controller = new AbortController();
        const timeout = setTimeout(
            () => controller.abort(),
            TIMEOUT_MS
        );

        try {
            console.log(`GET ${url} (pokušaj ${attempt})`);

            const response = await fetch(url, {
                headers: {
                    "User-Agent": USER_AGENT
                },
                signal: controller.signal
            });

            if (!response.ok) {
                const error = new Error(
                    `HTTP ${response.status} za ${url}`
                );

                error.status = response.status;
                throw error;
            }

            const html = await response.text();

            await fs.writeFile(cacheFile, html, "utf8");
            stats.pages_fetched++;

            console.log(`Uspješno preuzeto: ${url}`);

            return html;
        } catch (error) {
            const retryable =
                error.name === "AbortError" ||
                error.status >= 500 ||
                error.status === undefined;

            if (attempt === 1 && retryable) {
                console.warn(
                    `Zahtjev nije uspio. Pokušavam ponovo: ${error.message}`
                );
                continue;
            }

            throw error;
        } finally {
            clearTimeout(timeout);
        }
    }

    throw new Error(`Nije moguće preuzeti stranicu: ${url}`);
}

function extractCatalogueBooks(html, pageUrl, pageNumber) {
    const $ = cheerio.load(html);
    const books = [];

    $(".product_pod").each((_, element) => {
        const item = $(element);
        const title = item.find("h3 a").attr("title")?.trim();
        const relativeUrl = item.find("h3 a").attr("href");
        const priceText = item.find(".price_color").text().trim();

        if (!title || !relativeUrl || !priceText) {
            console.warn(
                `Nedostaju podaci za knjigu na katalogu ${pageNumber}.`
            );
            return;
        }

        books.push({
            title,
            product_url: new URL(relativeUrl, pageUrl).href,
            price_text: priceText,
            source_page: pageNumber
        });
    });

    return books;
}

function extractRating($) {
    const ratingClass = $(".star-rating")
        .attr("class")
        ?.split(/\s+/)
        .find(className => className !== "star-rating");

    const ratings = {
        One: "1",
        Two: "2",
        Three: "3",
        Four: "4",
        Five: "5"
    };

    return ratings[ratingClass] || null;
}

function extractBookDetails(html, catalogueBook) {
    const $ = cheerio.load(html);

    const title = $("div.product_main h1").text().trim();
    const priceText = $(".product_main .price_color").text().trim();

    const availabilityText = $(
        ".product_main .availability"
    ).text().replace(/\s+/g, " ").trim();

    const ratingText = extractRating($);

    const descriptionElement = $("#product_description").next("p");

    let description = descriptionElement.length
        ? descriptionElement.text().replace(/\s+/g, " ").trim()
        : null;

    // Uklanjamo ponovljeni dio ako je tekst dupliran potpuno isto.
    if (description) {
        const words = description.split(" ");
        const midpoint = Math.floor(words.length / 2);

        if (
            words.length % 2 === 0 &&
            words.slice(0, midpoint).join(" ") ===
            words.slice(midpoint).join(" ")
        ) {
            description = words.slice(0, midpoint).join(" ");
        }
    }

    // Izdvajamo broj iz cijene, čak i ako znak £ ima pogrešno kodiranje.
    const priceMatch = priceText.match(/(\d+(?:\.\d{1,2})?)/);
    const priceGbp = priceMatch ? Number(priceMatch[1]) : NaN;

    return {
        title,
        product_url: new URL(catalogueBook.product_url).href,
        price_text: priceText,
        price_gbp: priceGbp,
        availability_text: availabilityText,
        rating_text: ratingText,
        description,
        source_page: catalogueBook.source_page,
        fetched_at: new Date().toISOString()
    };
}

async function writeJson(fileName, data) {
    const filePath = path.join(OUTPUT_DIR, fileName);

    await fs.writeFile(
        filePath,
        JSON.stringify(data, null, 2),
        "utf8"
    );

    console.log(`Sačuvano: ${filePath}`);
}

async function main() {
    const startedAt = new Date();
    const startTime = Date.now();

    const validBooks = [];
    const errors = [];
    const uniqueBooks = new Map();

    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    try {
        // 1. Prikupljamo knjige sa prve tri stranice kataloga.
        let currentUrl = BASE_URL;

        for (let pageNumber = 1; pageNumber <= MAX_PAGES; pageNumber++) {
            let html;

            try {
                html = await fetchPage(currentUrl);
            } catch (error) {
                stats.failed_pages.push({
                    url: currentUrl,
                    reason: error.message
                });

                throw new Error(
                    `Katalog ${pageNumber} nije dostupan. ` +
                    `Ne mogu garantovati da imamo svih 60 knjiga.`
                );
            }

            const catalogueBooks = extractCatalogueBooks(
                html,
                currentUrl,
                pageNumber
            );

            for (const book of catalogueBooks) {
                uniqueBooks.set(book.product_url, book);
            }

            console.log(
                `Katalog ${pageNumber}: ${catalogueBooks.length} knjiga; ` +
                `ukupno jedinstvenih: ${uniqueBooks.size}`
            );

            if (pageNumber < MAX_PAGES) {
                const $ = cheerio.load(html);
                const nextHref = $("li.next a").attr("href");

                if (!nextHref) {
                    throw new Error(
                        `Nije pronađen link za katalog ${pageNumber + 1}.`
                    );
                }

                currentUrl = new URL(nextHref, currentUrl).href;
            }
        }

        console.log(
            `\nPočinjem obradu ${uniqueBooks.size} stranica knjiga...\n`
        );

        // 2. Obrađujemo detaljne stranice knjiga.
        const booksForProcessing = [...uniqueBooks.values()];
        const testFailureEnabled = process.argv.includes("--test-failure");

        // Test se pokreće samo ako koristimo --test-failure.
        // Adresa je lokalna i ne šalje zahtjev na drugu web-stranicu.
        if (testFailureEnabled) {
            booksForProcessing.push({
                title: "TEST - neuspješna lokalna stranica",
                product_url: "http://127.0.0.1:1/test-book.html",
                source_page: 1
            });

            console.log(
                "\nTEST GREŠKE JE UKLJUČEN: koristi se lokalna adresa.\n"
            );
        }

        for (const catalogueBook of booksForProcessing) {
            try {
                const html = await fetchPage(catalogueBook.product_url);
                const details = extractBookDetails(html, catalogueBook);

                const result = BookSchema.safeParse(details);

                if (!result.success) {
                    errors.push({
                        product_url: catalogueBook.product_url,
                        title: catalogueBook.title,
                        reason: result.error.issues.map(issue => ({
                            field: issue.path.join("."),
                            message: issue.message
                        }))
                    });

                    console.warn(
                        `VALIDACIJA NIJE USPJELA: ${catalogueBook.title}`
                    );

                    continue;
                }

                validBooks.push(result.data);

                console.log(
                    `[${validBooks.length + errors.length}/` +
                    `${booksForProcessing.length}] OK: ${result.data.title}`
                );
            } catch (error) {
                const failure = {
                    url: catalogueBook.product_url,
                    reason: error.message
                };

                stats.failed_pages.push(failure);

                errors.push({
                    product_url: catalogueBook.product_url,
                    title: catalogueBook.title,
                    reason: error.message
                });

                console.error(
                    `GREŠKA: ${catalogueBook.title}: ${error.message}`
                );
            }
        }
    } catch (error) {
        console.error(`\nGreška kataloga: ${error.message}`);
    } finally {
        // 3. Čuvamo rezultate i izvještaj čak i ako neke knjige ne uspiju.
        await writeJson("books.json", validBooks);
        await writeJson("errors.json", errors);

        const report = {
            started_at: startedAt.toISOString(),
            duration_ms: Date.now() - startTime,
            catalogue_pages_requested: MAX_PAGES,
            unique_books_found: uniqueBooks.size,
            pages_fetched: stats.pages_fetched,
            cache_hits: stats.cache_hits,
            valid_records: validBooks.length,
            invalid_records: errors.length,
            failed_pages: stats.failed_pages
        };

        await writeJson("run-report.json", report);

        console.log("\n--- IZVJEŠTAJ ---");
        console.log(JSON.stringify(report, null, 2));
    }
}

main().catch(error => {
    console.error("Neočekivana greška:", error);
    process.exitCode = 1;
});
