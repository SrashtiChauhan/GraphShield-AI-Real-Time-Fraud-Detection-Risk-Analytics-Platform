import random
import time

# possible values
locations = ["Delhi", "Mumbai", "Bangalore", "Chennai"]
risk_levels = ["LOW", "MEDIUM", "HIGH"]


def generate_transaction():
    """
    Generate a realistic transaction
    """

    amount = round(random.uniform(100, 5000), 2)

    # dynamic risk logic (more realistic)
    if amount > 3000:
        risk = "HIGH"
    elif amount > 1000:
        risk = "MEDIUM"
    else:
        risk = "LOW"

    transaction = {
        "user_id": random.randint(100, 200),
        "device_id": f"device_{random.randint(1, 5)}",  # ✅ FIXED
        "amount": amount,
        "location": random.choice(locations),
        "risk_level": risk
    }

    return transaction


def start_transaction_stream(interval=3):
    """
    Generate transactions continuously
    """

    while True:
        tx = generate_transaction()
        print("New Transaction:", tx)
        time.sleep(interval)