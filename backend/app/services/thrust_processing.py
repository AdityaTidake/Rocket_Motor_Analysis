import pandas as pd
import numpy as np
from app.services.metrics_calc import compute_metrics 


def validate_data(df):
    """Validate thrust CSV structure"""

    required_columns = ["time", "thrust"]

    for col in required_columns:
        if col not in df.columns:
            raise ValueError(f"Missing column: {col}")

    if (df["time"] < 0).any():
        raise ValueError("Time values cannot be negative")

    if (df["thrust"] < 0).any():
        raise ValueError("Thrust values cannot be negative")

    return df


def clean_data(df):
    """Clean and smooth thrust curve"""

    # sort by time
    df = df.sort_values("time")

    # fill missing values
    df = df.interpolate()

    # smooth thrust noise
    df["thrust"] = df["thrust"].rolling(3).mean()

    df["time"] = df["time"].round(3)
    df["thrust"] = df["thrust"].round(3) 

    # remove NaN rows
    df = df.dropna()

    return df



def process_thrust_curve(df):
    """Complete processing pipeline"""

    df = validate_data(df)

    df = clean_data(df)

    metrics = compute_metrics(df)

    return df 
