import networkx as nx

# create fraud graph
fraud_graph = nx.Graph()


def add_transaction(user_id, device_id):

    # add nodes
    fraud_graph.add_node(user_id, type="user")
    fraud_graph.add_node(device_id, type="device")

    # connect user and device
    fraud_graph.add_edge(user_id, device_id)


def detect_suspicious_device(device_id):

    # check how many users are connected to device
    if device_id in fraud_graph:

        connected_users = list(fraud_graph.neighbors(device_id))

        if len(connected_users) > 3:
            return {
                "graph_flag": True,
                "reason": "Multiple accounts using same device"
            }

    return {
        "graph_flag": False,
        "reason": "No suspicious graph activity"
    }