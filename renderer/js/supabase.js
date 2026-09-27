const {
    createClient
} = supabase;

const SUPABASE_URL =
    "https://abrgqpxnrubcfzexiqts.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_ZByxrXP_0zhYFvBln2-phA_HNmicVfx";

const supabaseClient =
    createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );