from fastapi import APIRouter, UploadFile, File, Query
from fastapi.responses import FileResponse
import pandas as pd
import numpy as np
import os

from app.utils.logger import setup_logger
from app.services.thrust_processing import process_thrust_curve
from app.services.metrics_calc import compute_metrics
from app.services.curve_fitting import best_fit_curve
from app.utils.filtering import filter_range
from app.utils.rse_generator import generate_rse_from_df

router = APIRouter(prefix="/upload", tags=["Upload"])
logger = setup_logger()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ✅ SINGLE FILE UPLOAD
@router.post("/")
async def upload_csv(
    file: UploadFile = File(...),
    min_time: float = Query(None),
    max_time: float = Query(None)
):
    try:
        logger.info("CSV upload started")

        # Save file
        filename = file.filename.replace(" ", "_")
        file_path = os.path.join(UPLOAD_FOLDER, filename)

        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)

        # Read CSV
        df = pd.read_csv(file_path)

        # Process
        df = process_thrust_curve(df)

        # Curve fitting
        fit_result = best_fit_curve(df["time"], df["thrust"])
        full_time = df["time"].values

        # Filtering
        df_filtered = filter_range(df, min_time, max_time)

        # Ideal curve filtering
        if min_time is not None and max_time is not None:
            mask = (full_time >= min_time) & (full_time <= max_time)
            filtered_ideal = np.array(fit_result["ideal_curve"])[mask]
            filtered_ideal = np.round(filtered_ideal, 3).tolist()
        else:
            filtered_ideal = fit_result["ideal_curve"]

        # Metrics
        metrics = compute_metrics(df_filtered)

        # Generate RSE
        rse_filename = filename.replace(".csv", ".rse")
        rse_path = os.path.join(UPLOAD_FOLDER, rse_filename)
        generate_rse_from_df(df, rse_path)

        return {
            "status": "success",
            "metrics": metrics,
            "best_fit_model": fit_result["best_model"],
            "equation": fit_result["equation"],
            "ideal_curve": filtered_ideal,
            "time": df_filtered["time"].tolist(),
            "thrust": df_filtered["thrust"].tolist(),
            "rse_file": rse_filename,
            "download_url": f"/upload/download-rse/?filename={rse_filename}"
        }

    except Exception as e:
        logger.exception("Error occurred")
        return {"status": "error", "message": str(e)}


# ✅ DOWNLOAD RSE
@router.get("/download-rse/")
def download_rse(filename: str):
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    if not os.path.exists(file_path):
        return {"error": "File not found"}

    return FileResponse(
        path=file_path,
        media_type="application/xml",
        filename=filename
    )


# ✅ COMPARE TWO MOTORS (FIXED)
@router.post("/compare")
async def compare(
    file1: UploadFile = File(...),
    file2: UploadFile = File(...)
):
    try:
        # ✅ Read files safely
        content1 = await file1.read()
        content2 = await file2.read()

        df1 = pd.read_csv(pd.io.common.BytesIO(content1))
        df2 = pd.read_csv(pd.io.common.BytesIO(content2))

        # Process
        df1 = process_thrust_curve(df1)
        df2 = process_thrust_curve(df2)

        # Metrics
        m1 = compute_metrics(df1)
        m2 = compute_metrics(df2)

        return {
            "status": "success",
            "motorA": {
                "metrics": m1,
                "time": df1["time"].tolist(),
                "thrust": df1["thrust"].tolist()
            },
            "motorB": {
                "metrics": m2,
                "time": df2["time"].tolist(),
                "thrust": df2["thrust"].tolist()
            }
        }

    except Exception as e:
        logger.exception("Compare error")
        return {"status": "error", "message": str(e)}