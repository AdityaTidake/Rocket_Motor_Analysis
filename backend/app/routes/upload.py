from fastapi import APIRouter, UploadFile, File
import pandas as pd
from app.services.thrust_processing import process_thrust_curve

router = APIRouter()


@router.post("/upload")
async def upload_csv(file: UploadFile = File(...)):

    try:

        # read csv
        df = pd.read_csv(file.file)

        # process thrust curve
        processed_df, metrics = process_thrust_curve(df)

        return {
            "status": "success",
            "metrics": metrics,
            "data_points": processed_df.to_dict(orient="records")
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }