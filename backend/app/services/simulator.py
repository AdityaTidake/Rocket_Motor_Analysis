import numpy as np

def simulate_flight(df, mass=1.5, Cd=0.75, area=0.01):

    g = 9.81
    rho = 1.225

    time = df["time"].values
    thrust = df["thrust"].values

    dt = time[1] - time[0]

    velocity = 0
    altitude = 0

    velocity_list = []
    altitude_list = []
    accel_list = []

    for F in thrust:

        drag = 0.5 * rho * Cd * area * velocity**2
        weight = mass * g

        accel = (F - weight - drag) / mass

        velocity = velocity + accel * dt
        altitude = altitude + velocity * dt

        velocity_list.append(velocity)
        altitude_list.append(altitude)
        accel_list.append(accel)

    return {
        "time": time.tolist(),
        "altitude": altitude_list,
        "velocity": velocity_list,
        "acceleration": accel_list
    }