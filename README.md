# Record to Text - Audio Transcription App

A modern web application that converts audio files to text using AI-powered speech recognition. Built with Python FastAPI backend and React frontend with shadcn/ui components.

## Features

- 🎵 Support for multiple audio formats (MP3, WAV, M4A, FLAC, OGG, WMA, AAC, MPEG, MPG, MP4)
- 🤖 AI-powered transcription using OpenAI Whisper
- 📄 Export options: Plain text or Word document (.docx)
- 🖱️ Drag & drop file upload
- 📊 Real-time progress tracking
- 🎨 Modern, responsive UI with dark/light mode support
- 🚀 Fast API for programmatic access
- ⚙️ Configurable via environment variables

## Tech Stack

### Backend

- **FastAPI** - Modern Python web framework
- **OpenAI Whisper** - State-of-the-art speech recognition
- **python-docx** - Word document generation
- **pydub** - Audio file processing

### Frontend

- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Radix UI** - Headless components

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

## Environment Configuration

The application uses environment variables for configuration. This allows easy deployment across different environments (development, staging, production) without code changes.

### Environment Files

- `.env` - Development environment variables (not in git)
- `.env.example` - Template with all available variables and descriptions
- `.env.production` - Production-specific overrides

### Setup Environment Variables

1. **Copy the example file:**

   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` for your environment:**

   ```bash
   # Backend Configuration
   BACKEND_HOST=0.0.0.0
   BACKEND_PORT=8000
   CORS_ALLOWED_ORIGINS=http://localhost:5173

   # Frontend Configuration
   VITE_API_BASE_URL=http://localhost:8000
   VITE_DEV_PORT=5173

   # Optional: Whisper Model Configuration
   PREFERRED_WHISPER_MODEL=large-v3
   ```

### Key Configuration Options

| Variable                  | Description                            | Default                 |
| ------------------------- | -------------------------------------- | ----------------------- |
| `BACKEND_HOST`            | Backend server host                    | `0.0.0.0`               |
| `BACKEND_PORT`            | Backend server port                    | `8000`                  |
| `CORS_ALLOWED_ORIGINS`    | Allowed CORS origins (comma-separated) | `http://localhost:5173` |
| `VITE_API_BASE_URL`       | Frontend API base URL                  | `http://localhost:8000` |
| `PREFERRED_WHISPER_MODEL` | Whisper model to use                   | `large-v3`              |
| `DEFAULT_TIMEOUT_MINUTES` | Default transcription timeout          | `10`                    |
| `VITE_MAX_FILE_SIZE_MB`   | Maximum file size in MB                | `500`                   |

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/revanza-git/audio-transcriber.git
cd audio-transcriber
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your preferred settings
# Default values work for local development
```

### 3. Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt
```

### 4. Frontend Setup

```bash
# Install Node.js dependencies
npm install
```

## Running the Application

### Method 1: Manual Start (Recommended for development)

#### Terminal 1 - Backend

```bash
cd backend
python main.py
```

The API will be available at `http://localhost:8000`

#### Terminal 2 - Frontend

```bash
npm run dev
```

The web app will be available at `http://localhost:5173`

### Method 2: Using Scripts

#### Windows

```bash
# Start both backend and frontend
./start.bat
```

#### Linux/Mac

```bash
# Start both backend and frontend
./start.sh
```

## API Usage

### Transcribe Audio File

**Endpoint:** `POST /transcribe`

**Parameters:**

- `file`: Audio file (multipart/form-data)
- `output_format`: "text" or "docx" (optional, default: "text")

**Example using curl:**

```bash
# Get JSON response
curl -X POST "http://localhost:8000/transcribe" \
  -F "file=@your_audio.mp3" \
  -F "output_format=text"

# Download DOCX file
curl -X POST "http://localhost:8000/transcribe" \
  -F "file=@your_audio.mp3" \
  -F "output_format=docx" \
  --output transcription.docx
```

**Text Response Example:**

```json
{
  "filename": "audio.mp3",
  "transcription": "Hello, this is a sample transcription...",
  "word_count": 50,
  "character_count": 280
}
```

### Other Endpoints

- `GET /` - API status
- `GET /health` - Health check
- `GET /supported-formats` - List supported audio formats

## Supported Audio Formats

- MP3 (.mp3)
- WAV (.wav)
- M4A (.m4a)
- FLAC (.flac)
- OGG (.ogg)
- WMA (.wma)
- AAC (.aac)
- MPEG (.mpeg)
- MPG (.mpg)
- MP4 (.mp4)

## Project Structure

```
audio-transcriber/
├── .env.example            # Environment variables template
├── .env                    # Local environment variables (not in git)
├── .env.production         # Production environment overrides
├── backend/
│   ├── main.py              # FastAPI application
│   ├── uploads/             # Temporary uploaded files
│   └── outputs/             # Generated output files
├── src/
│   ├── components/
│   │   ├── ui/             # shadcn/ui components
│   │   └── AudioTranscriber.tsx  # Main component
│   ├── lib/
│   │   └── utils.ts        # Utility functions
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── start.bat               # Windows startup script
├── start.sh                # Linux/Mac startup script
├── package.json            # Node.js dependencies
├── requirements.txt        # Python dependencies
├── vite.config.ts          # Vite configuration
└── README.md              # This file
```

## Features in Detail

### Audio Upload

- Drag and drop interface
- File validation
- Progress indicators
- Error handling

### Transcription

- Powered by OpenAI Whisper
- Automatic audio format conversion
- Real-time progress tracking
- Error recovery

### Export Options

- **Text**: JSON response with statistics
- **DOCX**: Formatted Word document
- **Download**: Direct file download

### UI Components

- Responsive design
- Loading states
- Error messages
- Success confirmations
- Dark/light mode ready

## Deployment

### Production Deployment

1. **Create production environment file:**

   ```bash
   cp .env.example .env.production
   ```

2. **Configure production variables:**

   ```bash
   # Backend Configuration
   BACKEND_HOST=0.0.0.0
   BACKEND_PORT=80
   BACKEND_DEBUG=False
   CORS_ALLOWED_ORIGINS=https://yourdomain.com

   # Frontend Configuration
   VITE_API_BASE_URL=https://api.yourdomain.com
   ```

3. **Build the application:**

   ```bash
   # Build frontend
   npm run build

   # The backend runs directly with python main.py
   ```

### Environment-Specific Configurations

- **Development**: Use `.env` with localhost URLs
- **Staging**: Create `.env.staging` with staging server URLs
- **Production**: Use `.env.production` with production URLs

### Docker Deployment

Environment variables can be passed to Docker containers:

```bash
docker run -d \
  -e BACKEND_HOST=0.0.0.0 \
  -e BACKEND_PORT=8000 \
  -e CORS_ALLOWED_ORIGINS=https://yourdomain.com \
  your-app-image
```

## Troubleshooting

### Common Issues

1. **Module not found errors**

   ```bash
   # Reinstall dependencies
   pip install -r requirements.txt
   npm install
   ```

2. **Environment variables not loading**

   ```bash
   # Ensure .env file exists
   cp .env.example .env

   # Check for syntax errors in .env file
   # Ensure no spaces around = in variable assignments
   # CORRECT: BACKEND_PORT=8000
   # INCORRECT: BACKEND_PORT = 8000
   ```

3. **CORS errors in browser**

   ```bash
   # Update CORS_ALLOWED_ORIGINS in .env
   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
   ```

4. **Frontend can't connect to backend**

   ```bash
   # Check VITE_API_BASE_URL in .env matches backend URL
   VITE_API_BASE_URL=http://localhost:8000
   ```

5. **Port already in use**

   - Backend: Change `BACKEND_PORT` in `.env`
   - Frontend: Change `VITE_DEV_PORT` in `.env`

6. **Whisper model download fails**

   - Ensure stable internet connection
   - Check Python version compatibility
   - Try different model: `PREFERRED_WHISPER_MODEL=medium`

7. **Audio file not supported**
   - Convert to supported format
   - Check file corruption

### Performance Tips

- Use WAV format for fastest processing
- Smaller files process faster
- Ensure adequate RAM for large files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
