# 🚀 Rocket Motor Analysis

Rocket Motor Analysis is a full-stack web application for analyzing rocket motor thrust data and running lightweight flight simulations. The system combines a FastAPI backend with a React + Vite frontend to let users upload motor CSV files, inspect processed thrust curves, compare motor performance, and simulate flight behavior using input aerodynamic parameters.

## 🧩 Tech Stack

- **Backend:** FastAPI, Python, Pandas, NumPy
- **Frontend:** React, Vite, React Router, Plotly
- **Data Processing:** CSV ingestion, curve normalization, thrust metrics, RSE generation
- **Styling/UI:** CSS and component-based React pages

## 📘 Project Overview

This project is organized into two main parts:

- Backend: FastAPI REST API that processes uploaded CSV files, computes metrics, generates RSE files, and runs simulation endpoints.
- Frontend: React application with pages for uploading data, comparing motors, and visualizing simulation output.

## ✨ Main Features

- Upload a thrust-vs-time CSV file for motor analysis
- Process and normalize motor data to a standard time/thrust format
- Compute key motor metrics such as maximum thrust, total impulse, and burn time
- Compare two uploaded motors side by side
- Run a simple flight simulation using mass, drag coefficient, area, and air density inputs
- Download generated RSE output for the processed motor curve

## 🗂️ Repository Structure

- `backend/` — FastAPI backend source code and API routes
- `frontend/` — React + Vite client application
- `data/` — supporting data and exports
- `docs/` — documentation and supporting materials
- `backend/uploads/` — runtime upload storage for user-provided CSV and RSE files

## ✅ Prerequisites

Before running the project, make sure you have:

- Python 3.10+ or compatible version
- Node.js and npm
- Git

## ⚙️ Backend Setup

1. Open a terminal in the project root.
2. Create and activate a virtual environment:

```bash
python -m venv .venv
.venv\Scripts\activate
```

3. Install backend dependencies:

```bash
pip install -r backend/requirements.txt
```

4. Start the FastAPI backend:

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API should be available at:

- http://localhost:8000
- API documentation: http://localhost:8000/docs

## 🎨 Frontend Setup

1. Open a second terminal.
2. Go to the frontend folder:

```bash
cd frontend
```

3. Install frontend dependencies:

```bash
npm install
```

4. Start the Vite development server:

```bash
npm run dev
```

The frontend should open at:

- http://localhost:5173

## 📦 Notes on Upload Storage

The backend stores uploaded runtime files under `backend/uploads/`.

This folder is intended for generated or user-provided runtime data, so the repository keeps the directory structure with a placeholder file and ignores the actual uploaded artifacts through the root Git ignore rules.

## 🧭 Demo Flow

A simple end-to-end user journey for this application looks like this:

1. Open the frontend at `http://localhost:5173`.
2. Navigate to the upload page and choose a motor thrust CSV file.
3. The backend processes the uploaded file, computes summary metrics, and returns the fitted curve and derived outputs.
4. Open the comparison page to compare two motors using the uploaded or processed data.
5. Use the simulation page to provide flight parameters such as mass, drag coefficient, area, and air density.
6. View the final output charts and metrics in the UI.


## Developed by:
- Dhanashree Sonawane
- Aditya Tidake


<!-- ## 📸 Screenshots

Add images here to document the main user-facing screens. Recommended screenshots:

- Landing / home page
- Upload page
- Motor comparison page
- Simulation page
- Result / chart visualization page

Example placeholder:

```text
screenshots/
  landing-page.png
  upload-page.png
  comparison-page.png
  simulation-page.png
```

If you have screenshots in the repository, place them under a `screenshots/` folder and reference them here. -->
