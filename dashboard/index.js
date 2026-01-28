const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const app = express();

// Save uploads to our resumes folder
const upload = multer({ dest: '../resumes/' });

app.get('/', (req, res) => {
    res.send(`
        <h1>AI Intern ATS</h1>
        <form action="/upload" method="post" enctype="multipart/form-data">
            <input type="file" name="resume" />
            <button type="submit">Scan Resume</button>
        </form>
    `);
});

app.post('/upload', upload.single('resume'), (req, res) => {
    const filePath = path.join(__dirname, '../resumes', req.file.filename);
    
    // This command triggers your Podman/Docker container
    const cmd = `podman run --rm -v /home/riordan/ai-intern-project/resumes:/app/resumes ai-ats-plugin /app/resumes/${req.file.filename}`;
    
    exec(cmd, (error, stdout, stderr) => {
        if (error) return res.send("Error: " + stderr);
        res.send("<h2>AI Score:</h2><pre>" + stdout + "</pre><a href='/'>Back</a>");
    });
});

app.listen(3000, () => console.log('Dashboard running at http://localhost:3000'));
