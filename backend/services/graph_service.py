import networkx as nx

# create fraud graph
fraud_graph = nx.Graph()


def add_transaction(user_id, device_id):
    """
    Add user-device connection to graph
    """

    # add nodes
    fraud_graph.add_node(user_id, type="user")
    fraud_graph.add_node(device_id, type="device")

    # connect user and device
    fraud_graph.add_edge(user_id, device_id)


def detect_suspicious_device(device_id):
    """
    Detect if a device is used by multiple users
    """

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


def get_graph_data():
    """
    Convert graph to frontend-friendly format
    """

    nodes = []
    edges = []

    for node in fraud_graph.nodes():
        nodes.append({
            "id": str(node),
            "label": str(node),
            "type": fraud_graph.nodes[node].get("type", "unknown")
        })

    for edge in fraud_graph.edges():
        edges.append({
            "source": str(edge[0]),
            "target": str(edge[1])
        })

    return {
        "nodes": nodes,
        "edges": edges
    }