# XAI-Project ✅

**A short, practical collection of predictive models and explainability experiments**. This repository contains datasets, notebooks, trained models, and a small frontend + Flask server used to explore model development and explainable AI (XAI) techniques on three applied problems: loan default classification, property value regression, and stock price regression.

---

## 🔍 Project Goals

-   Build and compare machine learning models for classification and regression tasks.
-   Apply and demonstrate explainability techniques (feature importance, visualizations, model-agnostic explanations) to make models more transparent.
-   Provide self-contained notebooks and a simple web demo to view model results and explanations.

---

## 📁 Repository Structure (high level)

-   `data/` — raw and processed datasets used in the experiments:

    -   `Loan Default Classification/` (train, test, submission)
    -   `Property Value Regression/` (multiple cleaned training sets and test)
    -   `Stock Regression/` (historical data and cleaned series)

-   `notebooks/` — analysis and modeling notebooks, organized per task:

    -   `Loan Prediction.ipynb` — classification pipeline and evaluation
    -   `Property Value Regression/` — cleaning, preprocessing, and modeling notebooks
    -   `Stock Regression/` — EDA, cleaning, and LSTM/time-series experiments

-   `xai-project/` — frontend web app (React/Vite) demonstrating results and XAI visualizations

    -   `flask server/` — Flask backend hosting saved models (`.joblib`) and API endpoints
    -   `src/` — React components and pages (`Home.jsx`, `Loan.jsx`, `Property.jsx`, `Stock.jsx`)

-   `README.md` — this document

---

## 🧪 Datasets

-   Loan Default Classification: binary classification problem to predict default risk.
-   Property Value Regression: predict property values using tabular features and engineered inputs.
-   Stock Regression: time-series data for TSLA; experiments include traditional statistical models and LSTM-based forecasting.

Dataset files and small descriptions are included inside `data/` subfolders for each task.

---

## 🧭 Notebooks & Experiments

-   Notebooks include EDA, feature engineering, training, hyperparameter exploration, and evaluation.
-   Each task folder contains focused notebooks to reproduce analyses and visualizations shown in the web app.

Tip: Open the notebooks in `notebooks/` to run experiments step-by-step and reproduce figures and metrics.

---

## 🧰 Models & Web Demo

-   Trained models used by the Flask demo are stored in `xai-project/flask server/` (e.g., `logistic_regression_model.joblib`, `random_forest_model_property_value.joblib`).
-   The React frontend calls the Flask backend to obtain predictions and explanation artifacts (feature importances, plots, etc.).

---

## 🧾 Key Files

-   `xai-project/src/pages/*` — pages used by the UI for each project area.
-   `xai-project/flask server/server.py` — simple API server exposing model prediction endpoints.
-   `notebooks/` — step-by-step reproducible analysis for modeling and explainability.

---
