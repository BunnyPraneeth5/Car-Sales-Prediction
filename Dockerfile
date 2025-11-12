FROM python:3.11-slim

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Node.js
RUN apt-get update && apt-get install -y nodejs npm && rm -rf /var/lib/apt/lists/*

# Copy project files
COPY . .

# Build frontend
WORKDIR /app/frontend
RUN npm install && npm run build

# Back to root
WORKDIR /app

# Expose port
EXPOSE 8000

# Run the app
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
