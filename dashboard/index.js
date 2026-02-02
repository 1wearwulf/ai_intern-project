// Polyfill for Object.hasOwn for older Node.js versions
if (!Object.hasOwn) {
    Object.hasOwn = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
}

const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const upload = multer({ dest: path.join(__dirname, '../resumes/') });

// Professional Dark Mode UI
const UI_TEMPLATE = (content) => `
<!DOCTYPE html>
<html>
<head>
    <title>🛡️ AI Intern ATS</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; background: #0f172a; color: #f8fafc; display: flex; justify-content: center; padding: 40px; }
        .card { background: #1e293b; padding: 30px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); width: 100%; max-width: 650px; border: 1px solid #334155; }
        h1 { color: #38bdf8; margin-bottom: 10px; }
        .upload-box { border: 2px dashed #475569; padding: 30px; border-radius: 12px; text-align: center; margin: 20px 0; transition: 0.3s; }
        .upload-box:hover { border-color: #38bdf8; background: #1e293b; }
        button { background: #38bdf8; color: #0f172a; border: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 16px; }
        button:disabled { background: #64748b; cursor: not-allowed; }
        pre { background: #0f172a; padding: 20px; border-radius: 8px; white-space: pre-wrap; color: #e2e8f0; border: 1px solid #334155; line-height: 1.6; }
        .loader { border: 4px solid #334155; border-top: 4px solid #38bdf8; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; display: none; margin: 15px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        a { color: #38bdf8; text-decoration: none; font-weight: bold; }
    </style>
</head>
<body>
    <div class="card">
        <h1>🛡️ AI Intern ATS</h1>
        ${content}
    </div>
</body>
</html>
`;

app.get('/', (req, res) => {
    res.send(UI_TEMPLATE(`
        <p>Upload a resume PDF for localized AI analysis.</p>
        <form id="uForm" action="/upload" method="post" enctype="multipart/form-data">
            <div class="upload-box">
                <input type="file" name="resume" accept=".pdf" required />
            </div>
            <button type="submit" id="sBtn">🚀 Scan Resume</button>
            <div class="loader" id="ldr"></div>
            <p id="msg" style="display:none; color: #94a3b8;">AI is thinking... this takes about 30-60 seconds.</p>
        </form>
        <script>
            document.getElementById('uForm').onsubmit = () => {
                document.getElementById('sBtn').disabled = true;
                document.getElementById('ldr').style.display = 'block';
                document.getElementById('msg').style.display = 'block';
            };
        </script>
    `));
});

app.post('/upload', upload.single('resume'), (req, res) => {
    const fileName = req.file.filename;
    // Optimization: added --log-disable to the command to clean up output
    const cmd = `podman run --rm -v ~/ai-intern-project/resumes:/app/resumes:Z ai-ats-plugin /app/resumes/${fileName}`;
    
    exec(cmd, { timeout: 120000 }, (error, stdout, stderr) => {
    if (error) {
        return res.send(UI_TEMPLATE(`<h2>❌ Error</h2><pre>${stderr || error.message}</pre><a href="/">← Try Again</a>`));
    }

    // Capture the AI output and format it
    const cleanOutput = stdout.split("--- ANALYSIS RESULT ---")[1] || stdout;
    
    // Simple logic to extract a number if the AI provided one (e.g., "Score: 85/100")
    const scoreMatch = cleanOutput.match(/(\d+)\/100/);
    const scoreHtml = scoreMatch ? `<div style="font-size: 48px; color: #38bdf8; font-weight: bold; text-align: center; margin-bottom: 20px;">${scoreMatch[0]}</div>` : '';

    res.send(UI_TEMPLATE(`
        <div style="text-align: center;">
            <h2 style="margin-bottom: 5px;">✅ Scan Complete</h2>
            <p style="color: #94a3b8; margin-top: 0;">Phi-3 Mini Analysis</p>
        </div>
        ${scoreHtml}
        <div style="background: #0f172a; border: 1px solid #334155; padding: 25px; border-radius: 12px; position: relative;">
            <div style="position: absolute; top: -10px; left: 20px; background: #38bdf8; color: #0f172a; padding: 2px 10px; border-radius: 4px; font-size: 12px; font-weight: bold;">FEEDBACK</div>
            <pre style="border: none; padding: 0; margin: 0;">${cleanOutput.trim()}</pre>
        </div>
        <br>
        <div style="text-align: center;">
            <a href="/" style="display: inline-block; background: #334155; color: white; padding: 10px 20px; border-radius: 8px;">Analyze Another Resume</a>
        </div>
    `));
});
});

app.listen(3000, () => console.log('🚀 Dashboard live at http://localhost:3000'));
