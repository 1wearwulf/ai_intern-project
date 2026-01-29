import sys
import os
import fitz  # PyMuPDF
import subprocess

def extract_text(pdf_path):
    text = ""
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

def query_ai(resume_text):
    # This calls the llama.cpp binary you built earlier
    # We pass a prompt asking the AI to act as an HR expert
    prompt = f"System: You are an ATS system. Rate this resume out of 100 based on technical skills. Resume: {resume_text[:1000]}"
    
    # Path to your llama.cpp executable and the phi3 model
    # Note: Adjust these paths if your model is stored elsewhere!
    cmd = ["/app/llama.cpp/main", "-m", "/app/models/phi3.gguf", "-p", prompt, "-n", "128"]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    return result.stdout

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python ats_logic.py <path_to_pdf>")
    else:
        resume_path = sys.argv[1]
        print(f"Reading: {resume_path}")
        content = extract_text(resume_path)
        print("Analyzing with AI...")
        analysis = query_ai(content)
        print("\n--- ANALYSIS RESULT ---")
        print(analysis)
