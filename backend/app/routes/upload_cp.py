from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
import pandas as pd
import numpy as np
import os

from app.utils.logger import setup_logger
from app.services.thrust_processing import process_thrust_curve
from app.services.metrics_calc import compute_metrics
from app.services.curve_fitting import best_fit_curve
from app.utils.filtering import filter_range
from app.utils.rse_generator import generate_rse_from_df   # ✅ NEW

router = APIRouter()
logger = setup_logger()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload")
async def upload_csv(file: UploadFile = File(...),
                     min_time: float = None,
                     max_time: float = None):

    try:
        logger.info("CSV upload started")

        # ✅ SAVE FILE (NEW)
        filename = file.filename.replace(" ", "_")
        file_path = os.path.join(UPLOAD_FOLDER, filename)

        with open(file_path, "wb") as f:
            f.write(await file.read())

        logger.info(f"CSV saved at {file_path}")

        # ✅ READ CSV
        df = pd.read_csv(file_path)
        logger.info("CSV loaded successfully")

        # Step 1: Clean data (UNCHANGED)
        df = process_thrust_curve(df)
        logger.info("Thrust curve processed")

        # Step 2: Fit on FULL data (UNCHANGED)
        fit_result = best_fit_curve(df["time"], df["thrust"])
        logger.info("Curve fitting completed")

        full_time = df["time"].values

        # Step 3: Filter for display (UNCHANGED)
        df_filtered = filter_range(df, min_time, max_time)

        # Step 4: Filter ideal curve (UNCHANGED)
        if min_time is not None and max_time is not None:
            mask = (full_time >= min_time) & (full_time <= max_time)
            filtered_ideal = np.array(fit_result["ideal_curve"])[mask]
            filtered_ideal = np.round(filtered_ideal, 3).tolist()
        else:
            filtered_ideal = fit_result["ideal_curve"]

        # Step 5: Metrics (UNCHANGED)
        metrics = compute_metrics(df_filtered)
        logger.info("Metrics calculated")

        # ✅ STEP 6: GENERATE RSE (NEW 🔥)
        rse_filename = filename.replace(".csv", ".rse")
        rse_path = os.path.join(UPLOAD_FOLDER, rse_filename)

        generate_rse_from_df(df, rse_path)   # using processed full data

        logger.info(f"RSE generated at {rse_path}")

        return {
            "status": "success",
            "metrics": metrics,
            "best_fit_model": fit_result["best_model"],
            "equation": fit_result["equation"],
            "ideal_curve": filtered_ideal,
            "time": df_filtered["time"].tolist(),
            "thrust": df_filtered["thrust"].tolist(),

            # ✅ NEW OUTPUT
            "rse_file": rse_filename,
            "download_url": f"/download-rse/?filename={rse_filename}"
        }

    except Exception as e:
        logger.exception("Error occurred during upload processing")
        return {
            "status": "error",
            "message": str(e)
        }


# ✅ DOWNLOAD API (NEW)
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