# Skin Cancer Detection App

An AI-powered web application for detecting skin cancer from images.

## Overview
This project integrates a **FastAPI** backend with a **React (Vite)** frontend to provide a seamless interface for analyzing skin lesion images using a pre-trained Deep Learning model.

## Features
- **Real-time Analysis**: Get immediate predictions.
- **Interactive UI**: User-friendly drag-and-drop interface.
- **Confidence Scores**: Detailed probability breakdown for predictions.
- **REST API**: Fully documented API endpoints.

## Project Structure

```
SkinCancerDetection/
├── backend/                # FastAPI Application
│   ├── app/
│   │   ├── main.py         # Entry point
│   │   ├── api/            # API Routes
│   │   ├── services/       # Inference Logic
│   │   └── core/           # Configuration
│   └── tests/              # Tests
├── frontend/               # React + Vite Application
│   ├── src/
│   └── public/
├── model/                  # Model artifacts (.h5, labels)
├── start.sh                # Launcher script
└── pyproject.toml          # Python Dependencies
```

## Getting Started

### Prerequisites
- **Python 3.11+**
- **Node.js 18+**
- **uv** (recommended for python packages)

### Quick Start

We have provided a single script to install dependencies and start both services:

```bash
chmod +x start.sh
./start.sh
```

### Manual Setup

**Backend:**
```bash
# Install dependencies
uv sync

# Run Server (from root)
export PYTHONPATH=$PYTHONPATH:$(pwd)/backend
uv run uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## API Documentation
Once the backend is running, you can access the interactive API docs at:
http://127.0.0.1:8000/docs
