# marketing_army.py - جيش التسويق التلقائي
import time
import random
import webbrowser
from datetime import datetime

# ========== الإعدادات ==========
VERSION = "1.0.0"
ARMY_NAME = "ClawGuardian Marketing Army"

# قائمة المنتديات والمنصات المستهدفة
PLATFORMS = [
    {"name": "Reddit SEO", "url": "https://www.reddit.com/r/SEO/submit", "type": "post"},
    {"name": "Reddit TechSEO", "url": "https://www.reddit.com/r/TechSEO/submit", "type": "post"},
    {"name": "Reddit bigseo", "url": "https://www.reddit.com/r/bigseo/submit", "type": "post"},
    {"name": "Quora", "url": "https://www.quora.com/", "type": "answer"},
    {"name": "LinkedIn", "url": "https://www.linkedin.com/feed/", "type": "post"},
]

# المنشورات الجاهزة (SEO + AI)
POSTS = [
    "🚀 I built a free AI tool that finds broken links on any website. Try it: https://freedlucas.pythonanywhere.com",
    "🔗 Dead Link Hunter - AI-powered broken link checker. Free and open source. https://freedlucas.pythonanywhere.com",
    "🛡️ Protect your OpenClaw from malicious skills with ClawGuardian. https://github.com/Freedingoxo/clawguardian-skill",
    "📊 Monitor your website health with Dead Link Hunter. Free AI tool: https://freedlucas.pythonanywhere.com",
    "💡 SEO tip: Find broken backlinks with AI. Try Dead Link Hunter: https://freedlucas.pythonanywhere.com",
]

# روابط الإحالة
REFERRAL_LINKS = [
    "https://accounts.binance.com/register?ref=551292696",
    "https://www.okx.com/join/60058118",
    "https://www.bybit.com/invite?ref=PDJO7W9",
    "https://www.bitget.com/?referralCode=YOUR_CODE",
]

def print_banner():
    print("="*50)
    print(f"🪖 {ARMY_NAME} v{VERSION}")
    print("="*50)
    print(f"✅ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📊 Platforms: {len(PLATFORMS)}")
    print(f"📝 Posts ready: {len(POSTS)}")
    print(f"🔗 Referral links: {len(REFERRAL_LINKS)}")
    print("="*50)

def execute_mission(platform, post):
    """تنفيذ مهمة تسويقية"""
    print(f"\n🎯 Mission: {platform['name']}")
    print(f"📝 Content: {post[:80]}...")
    print(f"🔗 Opening: {platform['url']}")
    webbrowser.open(platform['url'])
    return True

def main():
    print_banner()
    print("\n🪖 جيش التسويق التلقائي يعمل...")
    print("📢 سيتم فتح المنصات في متصفحك واحداً تلو الآخر\n")
    
    mission_count = 0
    for platform in PLATFORMS:
        post = random.choice(POSTS)
        execute_mission(platform, post)
        mission_count += 1
        print(f"✅ Mission {mission_count} completed")
        time.sleep(3)  # انتظار 3 ثواني بين كل منصة
    
    print("\n" + "="*50)
    print(f"🎉 All missions completed! Total: {mission_count}")
    print("📊 Next run: 6 hours")
    print("="*50)

if __name__ == "__main__":
    main()