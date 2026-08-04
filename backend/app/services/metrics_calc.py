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

g = 9.81

def calculate_metrics(time , thrust , propellant_mass = None):
    peak_thrust = np.max(thrust)
    avg_thrust = np.mean(thrust)
    burn_time = time[-1] - time[0]

    #total impulse (area under the curve)
    total_impulse = np.trapz(thrust, time)

    results = {
        "peak_thrust": round(float(peak_thrust), 3),
        "avg_thrust": round(float(avg_thrust), 3),
        "burn_time": round(float(burn_time), 3),
        "total_impulse": round(float(total_impulse), 3)
    }