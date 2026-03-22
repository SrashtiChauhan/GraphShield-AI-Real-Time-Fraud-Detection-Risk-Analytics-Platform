import random

# possible values
locations = ["Delhi", "Mumbai", "Bangalore", "Chennai"]
risk_levels = ["LOW", "MEDIUM", "HIGH"]

def generate_transaction():
    return {
        "user_id": random.randint(100, 200),
        "amount": round(random.uniform(100, 5000), 2),
        "location": random.choice(locations),
        "risk_level": random.choice(risk_levels)
    }