# from fastapi import APIRouter, HTTPException
# import pandas as pd
# from app.services.simulator import simulate_flight # This is correct HERE

# router = APIRouter()
# # ... rest of code

# @router.post("/simulate")
# async def run_simulation(data: dict):
#     # ... your existing validation logic ...
#     df = pd.DataFrame(data["thrust_curve"]).sort_values(by="time")
    
#     # This now calls the logic above
#     result = simulate_flight(df) 
    
#     return {"status": "success", "simulation": result}

from fastapi import APIRouter, HTTPException
import pandas as pd
from app.services.simulator import simulate_flight

# 1. DEFINE the router first
router = APIRouter()

# 2. NOW you can use the router decorator
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
        result = simulate_flight(df)

        return {
            "status": "success",
            "simulation": result
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")