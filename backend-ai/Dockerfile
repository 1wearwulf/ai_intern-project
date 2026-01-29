FROM python:3.11-slim-bookworm

# Install system dependencies for AI execution
RUN apt-get update && apt-get install -y libgomp1 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# We are copying from the project root into the container
COPY ../llama.cpp/main /app/llama.cpp/main
COPY ../models/phi3.gguf /app/models/phi3.gguf
COPY . .

RUN chmod +x /app/llama.cpp/main

ENTRYPOINT ["python", "ats_logic.py"]
