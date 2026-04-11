from fastapi import FastAPI
from app.routes.upload import  router as upload_router 
from app.routes.simulation import router as sim_router 
from app.routes.motor_compare import router as compare_router

app = FastAPI(title="Rocket Motor Analysis API")

app.include_router(upload_router)
app.include_router(sim_router)
app.include_router(compare_router)
    
@app.get("/")
def home():
    return {"status": "Rocket API running"}

    