import numpy as np

def compute_metrics(df):
    """Calculate motor metrics"""

    thrust = df["thrust"].values
    time = df["time"].values

    burn_time = time[-1] - time[0]

    total_impulse = np.trapezoid(thrust, time)

    avg_thrust = total_impulse / burn_time

    peak_thrust = np.max(thrust)

    return {
        "burn_time": np.round(float(burn_time), 3),
        "total_impulse": np.round(float(total_impulse),3),
        "avg_thrust": np.round(float(avg_thrust),3),
        "peak_thrust": np.round(float(peak_thrust),3) 
    }

