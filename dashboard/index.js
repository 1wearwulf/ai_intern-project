const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');


if (!Object.hasOwn) {
    Object.hasOwn = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
}

const app = express();
const upload = multer({ dest: '../resumes/' });

app.get('/', (req, res) => {
    res.send(`
        <body style="font-family:sans-serif; max-width:600px; margin:40px auto; text-align:center;">
            <h1>🛡️ AI Intern ATS</h1>
            <p>Upload a resume PDF to analyze it locally.</p>
            <form action="/upload" method="post" enctype="multipart/form-data">
                <input type="file" name="resume" accept=".pdf" required />
                <br><br>
                <button type="submit" style="padding:10px 20px; cursor:pointer;">Scan Resume</button>
            </form>
        </body>
    `);
});

app.post('/upload', upload.single('resume'), (req, res) => {
    const fileName = req.file.filename;
    
    // Command to run your freshly built Podman container

    const cmd = `podman run --rm -v ~/ai-intern-project/resumes:/app/resumes ai-ats-plugin /app/resumes/${fileName}`;
    
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            return res.send(`<h2>Error</h2><pre>${stderr || error.message}</pre><a href="/">Try Again</a>`);
        }
        res.send(`<h2>AI Analysis Result:</h2><pre style="background:#f4f4f4; padding:15px; border-radius:5px;">${stdout}</pre><a href="/">Back</a>`);
    });
});

app.listen(3000, () => console.log('🚀 Dashboard live at http://localhost:3000'));
