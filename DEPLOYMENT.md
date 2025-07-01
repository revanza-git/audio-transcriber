# Deployment Guide

This guide explains how to deploy the Record to Text application using environment variables for different environments.

## Environment Variables

The application uses environment variables to configure both the backend (Python/FastAPI) and frontend (React/Vite) components.

### Backend Environment Variables

| Variable                  | Default                                       | Description                                  |
| ------------------------- | --------------------------------------------- | -------------------------------------------- |
| `BACKEND_HOST`            | `0.0.0.0`                                     | Host for the FastAPI server                  |
| `BACKEND_PORT`            | `8000`                                        | Port for the FastAPI server                  |
| `BACKEND_DEBUG`           | `False`                                       | Enable debug mode                            |
| `CORS_ALLOWED_ORIGINS`    | `http://localhost:5173,http://localhost:3000` | Comma-separated list of allowed CORS origins |
| `DEFAULT_TIMEOUT_MINUTES` | `10`                                          | Default transcription timeout                |
| `MIN_TIMEOUT_MINUTES`     | `1`                                           | Minimum allowed timeout                      |
| `MAX_TIMEOUT_MINUTES`     | `60`                                          | Maximum allowed timeout                      |
| `UPLOAD_DIR`              | `uploads`                                     | Directory for uploaded files                 |
| `OUTPUT_DIR`              | `outputs`                                     | Directory for output files                   |
| `PREFERRED_WHISPER_MODEL` | `large-v3`                                    | Preferred Whisper model to load              |
| `FALLBACK_WHISPER_MODELS` | `medium,base,tiny`                            | Fallback models if preferred fails           |

### Frontend Environment Variables

| Variable                | Default                 | Description             |
| ----------------------- | ----------------------- | ----------------------- |
| `VITE_API_BASE_URL`     | `http://localhost:8000` | Backend API base URL    |
| `VITE_APP_TITLE`        | `Record to Text`        | Application title       |
| `VITE_MAX_FILE_SIZE_MB` | `500`                   | Maximum file size in MB |
| `VITE_DEV_PORT`         | `5173`                  | Development server port |
| `VITE_DEV_HOST`         | `localhost`             | Development server host |

## Setup Instructions

### 1. Local Development

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your local settings
# The default values should work for local development

# Start the application
./start.sh  # Linux/Mac
# or
start.bat   # Windows
```

### 2. Production Deployment

```bash
# Copy the production template
cp .env.production .env

# Edit .env with your production values
nano .env
```

Example production `.env`:

```env
# Backend Configuration
BACKEND_HOST=0.0.0.0
BACKEND_PORT=80
BACKEND_DEBUG=False
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Production timeout settings
DEFAULT_TIMEOUT_MINUTES=15
MAX_TIMEOUT_MINUTES=120

# Production directories
UPLOAD_DIR=/app/uploads
OUTPUT_DIR=/app/outputs

# Optimized model for production
PREFERRED_WHISPER_MODEL=medium

# Frontend Configuration
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_TITLE=Record to Text
```

### 3. Docker Deployment

Create a `docker-compose.yml`:

```yaml
version: "3.8"
services:
  backend:
    build: ./backend
    ports:
      - "${BACKEND_PORT}:${BACKEND_PORT}"
    environment:
      - BACKEND_HOST=${BACKEND_HOST}
      - BACKEND_PORT=${BACKEND_PORT}
      - CORS_ALLOWED_ORIGINS=${CORS_ALLOWED_ORIGINS}
      # Add other backend env vars
    volumes:
      - ./uploads:/app/uploads
      - ./outputs:/app/outputs

  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=${VITE_API_BASE_URL}
      # Add other frontend env vars
    depends_on:
      - backend
```

### 4. Environment-Specific Configurations

#### Development

- Use `.env` for local development
- CORS allows localhost origins
- Debug mode enabled
- Smaller timeout limits for testing

#### Staging

- Copy `.env.example` to `.env.staging`
- Use staging domain in CORS origins
- Moderate timeout limits
- Debug mode disabled

#### Production

- Use `.env.production`
- Restrict CORS to production domains only
- Higher timeout limits for large files
- Debug mode disabled
- Optimized Whisper model selection

### 5. Security Considerations

1. **Never commit `.env` files** (they're in `.gitignore`)
2. **Use HTTPS in production** for all URLs
3. **Restrict CORS origins** to your actual domains
4. **Set appropriate timeout limits** based on your server capacity
5. **Choose Whisper models** based on available resources

### 6. Troubleshooting

#### Backend Issues

- Check if all required environment variables are set
- Verify CORS origins match your frontend URL
- Ensure upload/output directories are writable

#### Frontend Issues

- Verify `VITE_API_BASE_URL` points to the correct backend
- Check browser network tab for CORS errors
- Ensure all `VITE_` prefixed variables are properly set

#### Model Loading Issues

- Try different Whisper models if the preferred one fails
- Check available system resources (RAM/GPU)
- Verify torch/torchaudio compatibility

### 7. Monitoring

The application provides health check endpoints:

- Backend: `GET /health` - Shows model status and configuration
- Backend: `GET /` - Basic API status

Use these for monitoring and load balancer health checks.
