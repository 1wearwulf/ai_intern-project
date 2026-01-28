FROM python:3.11-slim-bookworm

RUN groupadd -r internuser && useradd -r -g internuser internuser
WORKDIR /app
RUN mkdir -p /app/resumes && chown -R internuser:internuser /app

RUN apt-get update && apt-get install -y libmupdf-dev gcc && rm -rf /var/lib/apt/lists/*

# Use standard pip but with high timeout for your slow connection
RUN pip install --no-cache-dir --default-timeout=1000 requests pymupdf --retries 10

COPY --chown=internuser:internuser ats_logic.py .

USER internuser
ENTRYPOINT ["python", "ats_logic.py"]

