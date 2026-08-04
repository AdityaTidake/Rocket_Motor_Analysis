import pandas as pd
import numpy as np


def validate_data(df):
    """Validate thrust CSV structure"""

    # Normalize column names
    df.columns = [
        c.strip().lower().replace(" ", "").replace("(", "").replace(")", "")
        for c in df.columns
    ]

    # Map variations
    column_map = {
        "times": "time",
        "timesec": "time",
        "t": "time",
        "thrustn": "thrust",
        "force": "thrust"
    }

    df = df.rename(columns=column_map)

    # Required columns
    if "time" not in df.columns or "thrust" not in df.columns:
        raise ValueError("CSV must contain 'time' and 'thrust' columns")

    # Value checks
    if (df["time"] < 0).any():
        raise ValueError("Time cannot be negative")

    if (df["thrust"] < 0).any():
        raise ValueError("Thrust cannot be negative")

    return df


def clean_data(df):
    """Clean and smooth thrust curve"""

    df = df.sort_values("time")
    df = df.interpolate()

    df["thrust"] = df["thrust"].rolling(window=3, min_periods=1).mean()

    df["time"] = df["time"].round(3)
    df["thrust"] = df["thrust"].round(3)

    df = df.dropna()

    return df


def process_thrust_curve(df):
    """Complete processing pipeline"""

    df = validate_data(df)
    df = clean_data(df)

    return df