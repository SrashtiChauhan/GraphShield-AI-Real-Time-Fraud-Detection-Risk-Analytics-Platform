import numpy as np


# =========================
# 🔧 FEATURE ENGINEERING
# =========================
def create_features(transaction):
    import datetime

    features = []

    # 1️⃣ Amount
    features.append(transaction["amount"])

    # 2️⃣ Location → hash encoding
    location_encoded = abs(hash(transaction["location"])) % 1000
    features.append(location_encoded)

    # 3️⃣ Device encoding
    device_num = int(transaction["device_id"].split("_")[1])
    features.append(device_num)

    # 4️⃣ Time feature
    hour = datetime.datetime.now().hour
    features.append(hour)

    # 5️⃣ Fill remaining features
    while len(features) < 30:
        features.append(0)

    return features


# =========================
# 🧠 PREPROCESSING
# =========================
def preprocess_transaction(features):

    # ensure exactly 30 features
    if len(features) < 30:
        features = features + [0] * (30 - len(features))

    if len(features) > 30:
        features = features[:30]

    return features