import pandas as pd
import numpy as np


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

    # remove NaN rows
    df = df.dropna()

    return df


def compute_metrics(df):
    """Calculate motor metrics"""

    time = df["time"].values
    thrust = df["thrust"].values

    burn_time = time[-1] - time[0]

    total_impulse = np.trapezoid(thrust, time)

    avg_thrust = total_impulse / burn_time

    peak_thrust = np.max(thrust)

    return {
        "burn_time": float(burn_time),
        "total_impulse": float(total_impulse),
        "avg_thrust": float(avg_thrust),
        "peak_thrust": float(peak_thrust)
    }


def process_thrust_curve(df):
    """Complete processing pipeline"""

    df = validate_data(df)

    df = clean_data(df)

    metrics = compute_metrics(df)

    return df, metrics