import sys
import fitz  # PyMuPDF
import subprocess

def extract_text(pdf_path):
    text = ""
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

def query_ai(resume_text):
    # Phi-3 works best with this specific "Instruct" format
    prompt = f"<|user|>\nRate this resume out of 100 and give 2 sentences of feedback. Resume text: {resume_text[:1000]}<|end|>\n<|assistant|>"
    
    cmd = [
        "/app/llama.cpp/main", 
        "-m", "/app/models/phi3.gguf", 
        "-p", prompt, 
        "-n", "128", 
        "-t", "4",
        "--log-disable" # THIS IS KEY: It stops the technical spam
    ]
    
    # Run the command
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    # Extract only the AI's response after the prompt
    raw_output = result.stdout
    if "<|assistant|>" in raw_output:
        return raw_output.split("<|assistant|>")[-1].strip()
    return raw_output.strip()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python ats_logic.py <path_to_pdf>")
    else:
        resume_path = sys.argv[1]
        content = extract_text(resume_path)
        
        # We ONLY print the separator and the result so Node.js can't miss it
        print("--- ANALYSIS RESULT ---")
        print(query_ai(content))
