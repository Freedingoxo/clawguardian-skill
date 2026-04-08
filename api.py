from flask import Flask, jsonify
from supabase import create_client
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # تمكين CORS

SUPABASE_URL = 'https://oliefagvnorzhlzvdfyw.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9saWVmYWd2bm9yemhsenZkZnl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NjUwNDcsImV4cCI6MjA5MTE0MTA0N30.KZlFA_e3ub3zZnEZFBTGnshvyC9L2SNcwrfH9BiBauU'

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route('/api/stats')
def get_stats():
    skills = supabase.table('scanned_skills').select('*', count='exact').execute()
    threats = supabase.table('scanned_skills').select('*', count='exact').eq('risk_level', 'dangerous').execute()
    dead_links = supabase.table('dead_links').select('*', count='exact').execute()
    
    return jsonify({
        'total_skills': skills.count,
        'threats': threats.count,
        'dead_links': dead_links.count
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)