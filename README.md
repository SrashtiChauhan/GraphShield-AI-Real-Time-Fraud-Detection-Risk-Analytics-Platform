
# 🚀 GraphShield AI

### Real-Time Fraud Detection & Risk Analytics Platform


> A full-stack fraud detection system that combines **Machine Learning, Graph Analytics, and Real-Time Processing** to detect, analyze, and visualize suspicious transactions.

---

## 📌 Overview

GraphShield AI is a real-time fraud detection platform built to simulate and analyze financial transactions using intelligent risk scoring and graph-based relationship tracking.

The system processes transactions continuously, classifies risk levels, triggers alerts, and provides visual insights through dashboards and network graphs — enabling faster and more accurate fraud investigation.

---

## ✨ Key Features

### 🔍 Intelligent Fraud Detection

* ML-based fraud prediction with probability scoring
* Risk classification: **Low / Medium / High**
* Feature preprocessing + explainability

### ⚡ Real-Time Transaction Engine

* Continuous transaction simulation
* Live dashboard updates
* Event-driven processing pipeline

### 🚨 Alert Management System

* Automatic high-risk alert generation
* Timestamped alerts with reasons
* Investigation-ready interface

### 🌐 Fraud Network Graph

* Visualizes **User ↔ Device relationships**
* Detects suspicious clusters and connections
* Helps uncover hidden fraud patterns

### 📊 Analytics Dashboard

* Fraud rate and transaction insights
* Risk distribution visualization
* Category-based fraud trends

### 🤖 Model Monitoring

* Accuracy tracking over time
* Fraud ratio monitoring
* Drift detection (early warning signals)

---

## 📸 Screenshots

### 🔹 Overview Dashboard

<p align="center">
  <img src="assets/overview.png" width="850"/>
</p>

### 🔹 Transactions Monitoring

<p align="center">
  <img src="assets/transactions.png" width="850"/>
</p>

### 🔹 Fraud Alerts

<p align="center">
  <img src="assets/alerts.png" width="700"/>
</p>

### 🔹 Investigation Panel

<p align="center">
  <img src="assets/investigation.png" width="700"/>
</p>

### 🔹 Analytics Dashboard

<p align="center">
  <img src="assets/analytics.png" width="700"/>
</p>

### 🔹 Model Monitoring

<p align="center">
  <img src="assets/model.png" width="700"/>
</p>

### 🔹 Fraud Network Graph

<p align="center">
  <img src="assets/graph.png" width="700"/>
</p>

---

## 🧠 System Workflow

<p align="center">
  <img src="assets/workflow.png" width="700"/>
</p>

---

## 🏗️ Tech Stack

### Backend

* FastAPI
* SQLAlchemy
* SQLite
* Uvicorn

### Frontend

* React.js
* Tailwind CSS
* Recharts
* React Force Graph

### Machine Learning

* Scikit-learn
* Custom preprocessing pipeline

---

## 📁 Project Structure

```
GraphShield-AI/
│
├── backend/
│   ├── api/
│   ├── models/
│   ├── services/
│   ├── utils/
│   └── main.py
│
├── frontend/
│   ├── pages/
│   ├── components/
│   └── App.jsx
│
├── assets/       
│   ├── overview.png
│   ├── transactions.png
│   ├── alerts.png
│   ├── investigation.png
│   ├── analytics.png
│   ├── model.png
│   ├── graph.png
│   └── workflow.png
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/SrashtiChauhan/GraphShield-AI-Real-Time-Fraud-Detection-Risk-Analytics-Platform.git
cd GraphShield-AI-Real-Time-Fraud-Detection-Risk-Analytics-Platform
```

---

### 2. Backend Setup

```bash
cd backend

python -m venv venv

# Activate environment
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt

uvicorn backend.main:app --reload
```

Backend runs on:
👉 [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

### 3. Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

Frontend runs on:
👉 [http://localhost:5173](http://localhost:5173)

---

## 📡 API Endpoints

| Method | Endpoint      | Description        |
| ------ | ------------- | ------------------ |
| POST   | /predict      | Fraud prediction   |
| GET    | /transactions | Fetch transactions |
| GET    | /alerts       | Fraud alerts       |
| GET    | /graph        | Network graph data |
| GET    | /analytics    | Dashboard insights |
| GET    | /model-stats  | Model performance  |

---

## 🔥 Highlights

* Real-time fraud detection pipeline
* Graph-based anomaly detection (USP ⭐)
* End-to-end full-stack system
* Interactive dashboards with live data
* Clean modular architecture

---

## 🚀 Future Improvements

* JWT-based authentication
* Model retraining pipeline
* Advanced anomaly detection (Graph ML)
* Cloud deployment (AWS / Docker)
* Real-world dataset integration

---

## 👩‍💻 Author

**Srashti Chauhan**
B.Tech CSE | Aspiring Software Engineer

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

---

