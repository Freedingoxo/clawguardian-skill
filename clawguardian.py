# clawguardian.py - ClawGuardian Desktop Agent
import os
import re
import time
import hashlib
import json
import requests
from datetime import datetime
from pathlib import Path
from supabase import create_client

# ========== الإعدادات ==========
VERSION = "1.0.0"
APP_NAME = "ClawGuardian"

SUPABASE_URL = 'https://oliefagvnorzhlzvdfyw.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9saWVmYWd2bm9yemhsenZkZnl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NjUwNDcsImV4cCI6MjA5MTE0MTA0N30.KZlFA_e3ub3zZnEZFBTGnshvyC9L2SNcwrfH9BiBauU'

TELEGRAM_BOT_TOKEN = "8645197792:AAE2zwaOQ7ABNuZ5N0MXg5sCqzQnMUrCcOQ"
TELEGRAM_CHAT_ID = "7714049413"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# الأنماط الخبيثة
MALICIOUS_PATTERNS = {
    'command_injection': [r'curl.*\|.*bash', r'wget.*\|.*sh', r'eval\(', r'exec\('],
    'data_exfiltration': [r'webhook\.site', r'glot\.io', r'raw\.githubusercontent\.com'],
    'credential_theft': [r'PRIVATE_KEY', r'API_KEY', r'SECRET', r'TOKEN', r'\.env'],
    'persistence': [r'SOUL\.md', r'MEMORY\.md', r'AGENTS\.md'],
}

def send_telegram_alert(message):
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    try:
        requests.post(url, json={'chat_id': TELEGRAM_CHAT_ID, 'text': message})
        print(f"📨 Alert sent: {message[:50]}")
    except Exception as e:
        print(f"⚠️ Failed to send alert: {e}")

def scan_text_for_threats(text, source_name):
    threats = []
    for category, patterns in MALICIOUS_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, text, re.IGNORECASE):
                threats.append({'category': category, 'pattern': pattern, 'source': source_name})
                send_telegram_alert(f"🚨 [{APP_NAME}] Threat in {source_name}: {category}")
    return threats

def scan_openclaw_folder():
    openclaw_path = Path.home() / '.openclaw'
    if not openclaw_path.exists():
        return []
    threats = []
    for file_path in openclaw_path.glob('*.md'):
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            threats.extend(scan_text_for_threats(f.read(), f"OpenClaw/{file_path.name}"))
    return threats

def scan_skills_folder():
    skills_path = Path.home() / '.openclaw' / 'skills'
    if not skills_path.exists():
        return []
    threats = []
    for skill_file in skills_path.glob('*/SKILL.md'):
        with open(skill_file, 'r', encoding='utf-8', errors='ignore') as f:
            threats.extend(scan_text_for_threats(f.read(), f"Skill/{skill_file.parent.name}"))
    return threats

def save_to_supabase(threats):
    for threat in threats:
        supabase.table('detected_threats').insert({
            'category': threat['category'],
            'pattern': threat['pattern'],
            'source': threat['source'],
            'detected_at': datetime.now().isoformat()
        }).execute()

def main():
    print("="*50)
    print(f"🛡️ {APP_NAME} v{VERSION}")
    print("="*50)
    print("✅ Agent is running...")
    print("📁 Monitoring OpenClaw folder")
    print("🤖 Telegram alerts active")
    
    # إرسال رسالة تأكيد عند بدء التشغيل
    send_telegram_alert(f"✅ {APP_NAME} v{VERSION} is now online and monitoring your system!")
    
    while True:
        try:
            threats = scan_openclaw_folder()
            threats += scan_skills_folder()
            if threats:
                save_to_supabase(threats)
                print(f"[{datetime.now().strftime('%H:%M:%S')}] Found {len(threats)} threats")
            time.sleep(30)
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(60)

if __name__ == "__main__":
    main()