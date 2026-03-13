import shap
import numpy as np
import joblib
from pathlib import Path

# load model
BASE_DIR = Path(__file__).resolve().parent.parent
model_path = BASE_DIR / "models" / "fraud_model.pkl"

model = joblib.load(model_path)

explainer = None


def explain_prediction(features):
    global explainer

    data = np.array(features).reshape(1, -1)

    # create explainer only once
    if explainer is None:
        explainer = shap.Explainer(model.predict_proba, data)

    shap_values = explainer(data)

    contributions = shap_values.values[0].tolist()

    return {
        "top_contributions": contributions[:5]
    }