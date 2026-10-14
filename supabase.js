const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log("Supabase URL exists:", Boolean(supabaseUrl));
console.log("Supabase key exists:", Boolean(supabaseKey));

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;