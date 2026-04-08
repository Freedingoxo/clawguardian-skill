import json
from supabase import create_client

SUPABASE_URL = 'https://oliefagvnorzhlzvdfyw.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9saWVmYWd2bm9yemhsenZkZnl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NjUwNDcsImV4cCI6MjA5MTE0MTA0N30.KZlFA_e3ub3zZnEZFBTGnshvyC9L2SNcwrfH9BiBauU'

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

skills = supabase.table('scanned_skills').select('*', count='exact').execute()
threats = supabase.table('scanned_skills').select('*', count='exact').eq('risk_level', 'dangerous').execute()
dead_links = supabase.table('dead_links').select('*', count='exact').execute()

data = {
    'total_skills': skills.count,
    'threats': threats.count,
    'dead_links': dead_links.count,
    'updated_at': '2026-04-08'
}

with open('data.json', 'w') as f:
    json.dump(data, f)

print('✅ data.json created')
print(f'   total_skills: {skills.count}')
print(f'   threats: {threats.count}')
print(f'   dead_links: {dead_links.count}')