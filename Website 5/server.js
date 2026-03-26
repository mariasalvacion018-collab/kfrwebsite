const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Database setup
const db = new sqlite3.Database('./reports.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS help_reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            date TEXT NOT NULL,
            status TEXT DEFAULT 'new',
            assigned_to TEXT DEFAULT 'admin@kfr.com'
        )`);
    }
});

// API Routes
app.post('/api/help-reports', (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const date = new Date().toLocaleString();
    const sql = `INSERT INTO help_reports (name, email, subject, message, date, status, assigned_to) VALUES (?, ?, ?, ?, ?, 'new', 'admin@kfr.com')`;

    db.run(sql, [name, email, subject, message, date], function(err) {
        if (err) {
            console.error('Error inserting report:', err.message);
            return res.status(500).json({ error: 'Failed to save report' });
        }
        res.status(201).json({ id: this.lastID, message: 'Report submitted successfully' });
    });
});

app.get('/api/help-reports', (req, res) => {
    const sql = `SELECT * FROM help_reports ORDER BY date DESC`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching reports:', err.message);
            return res.status(500).json({ error: 'Failed to fetch reports' });
        }
        res.json(rows);
    });
});

app.put('/api/help-reports/:id', (req, res) => {
    const { id } = req.params;
    const { status, assigned_to } = req.body;

    const sql = `UPDATE help_reports SET status = ?, assigned_to = ? WHERE id = ?`;

    db.run(sql, [status, assigned_to, id], function(err) {
        if (err) {
            console.error('Error updating report:', err.message);
            return res.status(500).json({ error: 'Failed to update report' });
        }
        res.json({ message: 'Report updated successfully' });
    });
});

app.delete('/api/help-reports/:id', (req, res) => {
    const { id } = req.params;

    const sql = `DELETE FROM help_reports WHERE id = ?`;

    db.run(sql, [id], function(err) {
        if (err) {
            console.error('Error deleting report:', err.message);
            return res.status(500).json({ error: 'Failed to delete report' });
        }
        res.json({ message: 'Report deleted successfully' });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});