const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { generalLimiter } = require('./middleware/rateLimit');

const app = express();

// Middleware
app.use(helmet());
app.use(generalLimiter);
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/forums', require('./routes/forumRoutes'));
app.use('/api/threads', require('./routes/threadRoutes'));
app.use('/api', require('./routes/messageRoutes'));
app.use('/api/threads', require('./routes/moderatorRoutes'));

// Test route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Blug Forum API is running',
    timestamp: new Date().toISOString()
  });
});

// Home route with enhanced HTML
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blug Forum API 🇸🇪</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .status {
            background: #27ae60;
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            display: inline-block;
            font-weight: bold;
            margin-top: 10px;
        }
        .content {
            padding: 40px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }
        .section {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 10px;
            border-left: 5px solid #3498db;
        }
        .section h3 {
            color: #2c3e50;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .endpoint-list {
            list-style: none;
        }
        .endpoint-list li {
            background: white;
            margin: 10px 0;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e1e8ed;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .method {
            padding: 5px 12px;
            border-radius: 5px;
            font-weight: bold;
            font-size: 0.9em;
        }
        .get { background: #e3f2fd; color: #1976d2; }
        .post { background: #e8f5e8; color: #388e3c; }
        .put { background: #fff3e0; color: #f57c00; }
        .delete { background: #ffebee; color: #d32f2f; }
        .test-links a {
            display: inline-block;
            background: #3498db;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            margin: 5px;
            transition: background 0.3s;
        }
        .test-links a:hover {
            background: #2980b9;
        }
        .instructions {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }
        @media (max-width: 768px) {
            .content {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1> Blug Forum API</h1>
            <p>Blug Forum - Secure and Advanced Forum System</p>
            <div class="status"> Server is running successfully</div>
        </div>
        
        <div class="content">
            <div class="section">
                <h3> Main Endpoints</h3>
                <ul class="endpoint-list">
                    <li>
                        <span>/api/auth/login</span>
                        <span class="method post">POST</span>
                    </li>
                    <li>
                        <span>/api/auth/register</span>
                        <span class="method post">POST</span>
                    </li>
                    <li>
                        <span>/api/users</span>
                        <span class="method get">GET</span>
                    </li>
                    <li>
                        <span>/api/forums</span>
                        <span class="method get">GET</span>
                    </li>
                    <li>
                        <span>/api/forums</span>
                        <span class="method post">POST</span>
                    </li>
                    <li>
                        <span>/api/threads</span>
                        <span class="method post">POST</span>
                    </li>
                </ul>
            </div>
            
            <div class="section">
                <h3> Quick Test</h3>
                <div class="test-links">
                    <a href="/api/health" target="_blank">Check Server Health</a>
                    <a href="/api/forums" target="_blank">View Forums</a>
                </div>
                
                <div class="instructions">
                    <h4> How to Use:</h4>
                    <p><strong>To test the API:</strong> Use Postman with this Header:</p>
                    <code>Authorization: Bearer YOUR_TOKEN</code>
                    <p style="margin-top: 10px;"><strong>To get token:</strong> Login via /api/auth/login</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
  `);
});

module.exports = app;