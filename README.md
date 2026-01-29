# AI-Powered ATS System (Zero-Trust Hardened)

An Automated Talent Screening (ATS) system built with a focus on security, containerization, and local AI execution.

## 🚀 Features
- **Local AI:** Uses `phi3.gguf` via `llama.cpp` for private, offline data processing.
- **Secure Architecture:** Python logic containerized using **Podman/Docker** for process isolation.
- **Hardened Environment:** Built on a host following **CIS Ubuntu Hardening** benchmarks (Task 1).
- **Web Dashboard:** Node.js/Express interface for seamless resume uploads.
- **Networking:** Integrated with **Tailscale** for secure remote AI inference.

## 📂 Project Structure
- `/backend-ai`: Python logic & Dockerfile (The Scanner).
- `/dashboard`: Node.js Express server (The UI).
- `/resumes`: Secure volume for document processing.

## 🛠️ How to Run
1. Build the container: \`podman build -t ai-ats-plugin ./backend-ai\`
2. Start the dashboard: \`cd dashboard && node index.js\`
3. Access at \`http://localhost:3000\`
