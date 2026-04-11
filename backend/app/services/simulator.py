import numpy as np

def simulate_flight(df, mass=1.5, Cd=0.75, area=0.01):
    try:
        g = 9.81
        rho = 1.225

        # ✅ Ensure numeric values
        df["time"] = df["time"].astype(float)
        df["thrust"] = df["thrust"].astype(float)

        # ✅ Remove NaN
        df = df.dropna()

        time = df["time"].values
        thrust = df["thrust"].values

        velocity = 0.0
        altitude = 0.0

        velocity_list = []
        altitude_list = []
        accel_list = []

        for i in range(len(time)):
            # ✅ Safe drag calculation
            drag = 0.5 * rho * Cd * area * (velocity ** 2)

            accel = (thrust[i] - drag - mass * g) / mass

            # ✅ Safe timestep
            dt = time[i] - time[i-1] if i > 0 else 0.01
            if dt <= 0:
                dt = 0.01  # fallback safety

            velocity += accel * dt
            altitude += velocity * dt

            velocity_list.append(float(velocity))
            altitude_list.append(float(altitude))
            accel_list.append(float(accel))

        return {
            "time": time.tolist(),
            "velocity": velocity_list,
            "altitude": altitude_list,
            "acceleration": accel_list
        }

    except Exception as e:
        print("SIMULATOR ERROR:", str(e))  # 🔥 important debug
        raise e