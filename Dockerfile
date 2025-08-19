# Use slim Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /code

# Install system deps
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for caching)
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy app files
COPY . /code

# Expose port (Hugging Face expects 7860)
EXPOSE 7860

# Run the API
CMD ["python", "main.py"]
