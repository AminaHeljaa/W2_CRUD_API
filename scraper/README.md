# The Polite Scraper

A Node.js web scraper that collects book information from [Books to Scrape](https://books.toscrape.com/), a website intended for scraping practice.

## 1. Project overview

The scraper processes the first three catalogue pages and collects up to 60 unique books. It extracts book information, validates the records, saves the results as JSON and generates a run report.

## 2. Technologies

- Node.js 20 or newer
- JavaScript
- Fetch API
- Cheerio for HTML parsing
- Zod for data validation
- JSON for output files

## 3. Installation

Open a terminal in the `scraper` directory and run:

```bash
npm install
```

## 4. Run the scraper

Run the normal scraping process:

```bash
node src/index.js
```

Test the error-handling behaviour:

```bash
node src/index.js --test-failure
```

The test mode introduces a deliberately unreachable local URL to verify that a failed detail page is reported without losing the valid book records. Run the normal command afterwards to regenerate the normal report.

## 5. Output files

The scraper writes its results to the `output/` directory:

- `books.json` — successfully validated book records.
- `errors.json` — records or pages that could not be processed successfully.
- `run-report.json` — execution statistics, cache hits, record counts and failed pages.

Each book record contains:

- `title`
- `product_url`
- `price_text`
- `price_gbp`
- `availability_text`
- `rating_text`
- `description`
- `source_page`
- `fetched_at`

The `description` field may be `null` when a description is unavailable. The `source_page` field identifies the catalogue page (1–3) where the book was found.

## 6. Caching and politeness

- Catalogue pages are cached locally to reduce repeated requests.
- The scraper uses an identifiable User-Agent.
- Requests have a timeout and check HTTP responses.
- A delay of at least 500 milliseconds is used between real requests.
- Transient network errors and server errors are retried once.
- HTTP 403 and 404 responses are not retried.
- Duplicate books are removed using their product URLs.
- A failed detail page is recorded without stopping the entire run.

The local `cache/` directory and `node_modules/` are excluded from version control.

## 7. Target and ethics

**Target classification:** Books to Scrape is a practice website intended for web-scraping exercises.

The `robots.txt` endpoint returned HTTP 404 during inspection. A 404 response means that the requested robots.txt file was not found; it does not by itself grant permission or indicate a prohibition.

The scraper is deliberately limited to the first three catalogue pages and uses request delays to reduce load.

**I will not reuse this code on another site without checking its rules and terms first.**

## 8. Why no browser automation?

The required information is available in the website's HTML, so direct HTTP requests and Cheerio are sufficient. A browser automation tool would add unnecessary complexity for this task.

## 9. Example run report

A successful normal run should report 60 unique books, 60 valid records, no invalid records and no failed pages when all required pages are available.

Cache hits and pages fetched may vary depending on whether cached content is available. The actual results are recorded in `output/run-report.json`.
