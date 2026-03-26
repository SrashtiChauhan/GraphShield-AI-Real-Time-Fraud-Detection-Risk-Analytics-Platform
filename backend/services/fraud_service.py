import joblib 
import numpy as np
from pathlib import Path

# load model and scaler
BASE_DIR=Path(__file__).resolve().parent.parent
model_path=BASE_DIR / "models" / "fraud_model.pkl"
scalar_path=BASE_DIR / "models" / "scaler.pkl"
model=joblib.load(model_path)
scaler=joblib.load(scalar_path)

def predict_fraud(transaction_features):
    # convert input to numpy array
    features=np.array(transaction_features).reshape(1, -1)
    # scale features
    scaled_features=scaler.transform(features)
    # predict probabilities
    fraud_prob=model.predict_proba(scaled_features)[0][1]
    #classify risk
    prediction=int(fraud_prob > 0.5)
    return {
    "fraud_probability": float(fraud_prob),
    "prediction": int(prediction)
}