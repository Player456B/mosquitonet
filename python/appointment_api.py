from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database setup
def init_db():
    conn = sqlite3.connect('appointments.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS appointments
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT NOT NULL,
                  phone TEXT NOT NULL,
                  address TEXT NOT NULL,
                  city TEXT,
                  date TEXT NOT NULL,
                  time TEXT,
                  service TEXT,
                  sqft TEXT,
                  notes TEXT,
                  timestamp TEXT)''')
    conn.commit()
    conn.close()

@app.route('/api/appointment', methods=['POST'])
def book_appointment():
    try:
        data = request.json
        
        # Connect to database
        conn = sqlite3.connect('appointments.db')
        c = conn.cursor()
        
        # Insert appointment
        c.execute('''INSERT INTO appointments 
                     (name, phone, address, city, date, time, service, sqft, notes, timestamp)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                  (data['name'], data['phone'], data['address'], data['city'],
                   data['date'], data['time'], data['service'], data['sqft'],
                   data['notes'], data['timestamp']))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Appointment booked successfully',
            'id': c.lastrowid
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/appointments', methods=['GET'])
def get_appointments():
    try:
        conn = sqlite3.connect('appointments.db')
        c = conn.cursor()
        
        c.execute('SELECT * FROM appointments ORDER BY timestamp DESC')
        appointments = c.fetchall()
        conn.close()
        
        return jsonify({
            'success': True,
            'appointments': appointments
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/appointments/today', methods=['GET'])
def get_today_appointments():
    try:
        today = datetime.now().strftime('%Y-%m-%d')
        conn = sqlite3.connect('appointments.db')
        c = conn.cursor()
        
        c.execute('SELECT * FROM appointments WHERE date = ?', (today,))
        appointments = c.fetchall()
        conn.close()
        
        return jsonify({
            'success': True,
            'date': today,
            'count': len(appointments),
            'appointments': appointments
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    init_db()
    print("✅ Database initialized")
    print("🚀 Server running on http://localhost:5000")
    app.run(debug=True, port=5000)
