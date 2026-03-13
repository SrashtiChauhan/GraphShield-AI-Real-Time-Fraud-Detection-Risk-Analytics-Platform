import numpy as np


def preprocess_transaction(features):
    """
    Ensure transaction features are in correct format
    """

    if len(features) != 30:
        raise ValueError("Transaction must contain 30 features")

    # convert to numpy array
    data = np.array(features)

    return data