from fastapi import APIRouter
import pandas as pd 
from app.services.simulator import simulate_flight

router = APIRouter()

@router.post("/simulate")
async def run_simulation(data:dict):

    df = pd.DataFrame(data["thrust_curve"])

    result = simulate_flight(df)

    return {
        "status": "success",
        "simulation": result
}