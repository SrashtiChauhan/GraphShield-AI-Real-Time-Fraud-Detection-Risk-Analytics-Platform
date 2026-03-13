# In-memory storage for GraphShield

recent_transactions = []
fraud_alerts = []
device_connections = {}


def store_transaction(transaction):
    """
    Store latest transactions in memory
    """

    recent_transactions.append(transaction)

    # keep only last 100 transactions
    if len(recent_transactions) > 100:
        recent_transactions.pop(0)


def store_alert(alert):
    """
    Store fraud alerts
    """

    fraud_alerts.append(alert)


def register_device(user_id, device_id):
    """
    Track which users use which devices
    """

    if device_id not in device_connections:
        device_connections[device_id] = []

    device_connections[device_id].append(user_id)


def get_recent_transactions():
    return recent_transactions


def get_alerts():
    return fraud_alerts