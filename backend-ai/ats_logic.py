import requests
import json
import sys
import psutil
import os

# Configuration
URL = "http://100.106.29.116:8080/v1/chat/completions"
API_KEY = "Back2space" 
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

def get_sys_stats():
    try:
        cpu = psutil.cpu_percent(interval=0.1)
        mem = psutil.virtual_memory().percent
        return f"[CPU: {cpu}% | RAM: {mem}%]"
    except:
        return "[Stats Error]"

def chat():
    messages = [{"role": "system", "content": "You are a helpful AI Intern running in a hardened sandbox."}]
    os.system('clear')
    print("="*50)
    print(f"--- AI Intern Interactive Chat ---")
    print("="*50)
    print("Type 'quit' to exit.")
    
    while True:
        stats = get_sys_stats()
        try:
            user_input = input(f"\n{stats} You: ")
        except EOFError:
            break
            
        if user_input.lower() in ['quit', 'exit']:
            break
            
        messages.append({"role": "user", "content": user_input})
        payload = {"messages": messages, "temperature": 0.7, "stream": True}

        try:
            response = requests.post(URL, headers=HEADERS, json=payload, stream=True)
            response.raise_for_status()
            print("\nIntern: ", end="", flush=True)
            full_content = ""

            for line in response.iter_lines():
                if line:
                    line_text = line.decode('utf-8')
                    if line_text.startswith("data: "):
                        data_str = line_text[6:]
                        if data_str.strip() == "[DONE]": break
                        try:
                            chunk = json.loads(data_str)
                            content = chunk['choices'][0]['delta'].get('content', '')
                            if content:

                               print(content, end="", flush=True)
                               full_content += content
                        except: continue
            print() 
            messages.append({"role": "assistant", "content": full_content})
        except Exception as e:
            print(f"\n[!] Error: {e}")

if __name__ == "__main__":
    chat()
