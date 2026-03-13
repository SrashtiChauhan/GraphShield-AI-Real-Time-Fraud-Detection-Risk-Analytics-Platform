import random
import time


def generate_transaction():
    """
    Simulate a random transaction
    """

    transaction = {
        "user_id": random.randint(100, 200),
        "device_id": f"device_{random.randint(1,5)}",
        "amount": round(random.uniform(10, 5000), 2)
    }

    return transaction


def start_transaction_stream(interval=3):
    """
    Generate transactions every few seconds
    """

    while True:

        tx = generate_transaction()

        print("New Transaction:", tx)

        time.sleep(interval)