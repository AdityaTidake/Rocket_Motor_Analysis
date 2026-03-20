# from fastapi import APIRouter, UploadFile, File
# import pandas as pd
# import numpy as np

# from app.utils.logger import setup_logger 
# from app.services.thrust_processing import process_thrust_curve
# from app.services.metrics_calc import compute_metrics  
# from app.services.curve_fitting import best_fit_curve
# from app.utils.filtering import filter_range

# router = APIRouter()

# logger = setup_logger() 

# @router.post("/upload")
# async def upload_csv(file: UploadFile = File(...),
#                      min_time: float = None,
#                      max_time: float = None):

#     try:

#         # read csv
#         logger.info("CSV upload started") 
#         df = pd.read_csv(file.file)
#         logger.info("CSV loaded successfully")

#         # process thrust curve
#         # processed_df, metrics = process_thrust_curve(df)

#         df, metrics = process_thrust_curve(df)
#         logger.info("Thrust curve processed")
        
#         fit_result = best_fit_curve(df["time"], df["thrust"])
#         logger.info("Curve fitting completed")  

#         df = filter_range(df, min_time, max_time)

#         if min_time is not None and max_time is not None:
#             mask = (df["time"] >= min_time) & (df["time"] <= max_time)

#             filtered_ideal = np.array(fit_result["ideal_curve"])[mask]
#             filtered_ideal = np.round(filtered_ideal, 3).tolist()
#         else:
#             filtered_ideal = fit_result["ideal_curve"]

#         metrics = compute_metrics(df)
#         logger.info("Metrics calculated")

        

#         #fit_result = best_fit_curve(df["time"], df["thrust"]) 
#         print(type(fit_result))
#         print(fit_result)

#         return {
#             "status": "success", 
#             "metrics": metrics,
#             "best_fit_model": fit_result["best_model"], 
#             "equation": fit_result["equation"],
#             "ideal_curve": fit_result["ideal_curve"],
#             "time": df["time"].tolist(),
#             "thrust": df["thrust"].tolist()
#         }
    
        

#     except Exception as e:
#         logger.exception("Error occurred during upload processing")
#         return {
#             "status": "error",
#             "message": str(e)
#         }
    


from fastapi import APIRouter, UploadFile, File
import pandas as pd
import numpy as np

from app.utils.logger import setup_logger
from app.services.thrust_processing import process_thrust_curve
from app.services.metrics_calc import compute_metrics
from app.services.curve_fitting import best_fit_curve
from app.utils.filtering import filter_range

router = APIRouter()
logger = setup_logger()


@router.post("/upload")
async def upload_csv(file: UploadFile = File(...),
                     min_time: float = None,
                     max_time: float = None):

    try:

        logger.info("CSV upload started")

        df = pd.read_csv(file.file)
        logger.info("CSV loaded successfully")

        # Step 1: Clean data
        df = process_thrust_curve(df)
        logger.info("Thrust curve processed")

        # Step 2: Fit on FULL data
        fit_result = best_fit_curve(df["time"], df["thrust"])
        logger.info("Curve fitting completed")

        full_time = df["time"].values

        # Step 3: Filter for display
        df_filtered = filter_range(df, min_time, max_time)

        # Step 4: Filter ideal curve
        if min_time is not None and max_time is not None:

            mask = (full_time >= min_time) & (full_time <= max_time)

            filtered_ideal = np.array(fit_result["ideal_curve"])[mask]
            filtered_ideal = np.round(filtered_ideal, 3).tolist()

        else:
            filtered_ideal = fit_result["ideal_curve"]

        # Step 5: Metrics
        metrics = compute_metrics(df_filtered)
        logger.info("Metrics calculated")

        return {
            "status": "success",
            "metrics": metrics,
            "best_fit_model": fit_result["best_model"],
            "equation": fit_result["equation"],
            "ideal_curve": filtered_ideal,
            "time": df_filtered["time"].tolist(),
            "thrust": df_filtered["thrust"].tolist()
        }

    except Exception as e:
        logger.exception("Error occurred during upload processing")
        return {
            "status": "error",
            "message": str(e)
        }