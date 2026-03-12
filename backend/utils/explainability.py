import shap
import numpy as np
import joblib
from pathlib import Path

# load model
BASE_DIR = Path(__file__).resolve().parent.parent
model_path = BASE_DIR / "models" / "fraud_model.pkl"

model = joblib.load(model_path)

explainer = shap.TreeExplainer(model)


def explain_prediction(features):

    data = np.array(features).reshape(1, -1)

    shap_values = explainer.shap_values(data)

    # get top feature contributions
    contributions = shap_values[0].tolist()

    return {
        "top_contributions": contributions[:5]
    }