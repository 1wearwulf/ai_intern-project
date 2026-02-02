FROM python:3.12-slim-bookworm

# Install system dependencies for AI and PDF processing
RUN apt-get update && apt-get install -y libgomp1 libgl1-mesa-glx && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the offline python packages and install them
COPY docker_bags /app/docker_bags
RUN pip install --no-index --find-links=/app/docker_bags /app/docker_bags/*.whl

# Copy the AI engine and model
COPY llama.cpp/main /app/llama.cpp/main
COPY models/phi3.gguf /app/models/phi3.gguf
COPY . .

RUN chmod +x /app/llama.cpp/main

ENTRYPOINT ["python", "ats_logic.py"]
