from fastapi import APIRouter, HTTPException
import pandas as pd
from app.services.simulator import simulate_flight

# 1. DEFINE the router first
router = APIRouter()

# 2. use the router decorator
@router.post("/simulate")
async def run_simulation(data: dict):
    print(f"DEBUG: Received data for simulation: {data}")   
    try:
        if "thrust_curve" not in data:
            raise HTTPException(status_code=400, detail="Missing 'thrust_curve'")

        df = pd.DataFrame(data["thrust_curve"])
        df.columns = [c.strip().lower() for c in df.columns]

        if "time" not in df.columns or "thrust" not in df.columns:
            raise HTTPException(status_code=400, detail="Missing 'time' or 'thrust' columns")

        df = df.sort_values(by="time")

        required_params = ("mass", "Cd", "area", "rho")
        missing_params = [param for param in required_params if param not in data]
        if missing_params:
            raise HTTPException(
                status_code=400,
                detail=f"Missing simulation parameters: {', '.join(missing_params)}",
            )

        try:
            mass = float(data["mass"])
            cd = float(data["Cd"])
            area = float(data["area"])
            rho = float(data["rho"])
        except (TypeError, ValueError):
            raise HTTPException(
                status_code=400,
                detail="Simulation parameters mass, Cd, area, and rho must be numeric",
            )

        if mass <= 0 or cd < 0 or area <= 0 or rho <= 0:
            raise HTTPException(
                status_code=400,
                detail="Simulation parameters must satisfy: mass > 0, Cd >= 0, area > 0, rho > 0",
            )

        result = simulate_flight(df, mass=mass, Cd=cd, area=area, rho=rho)

        return {
            "status": "success",
            "simulation": result
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")
