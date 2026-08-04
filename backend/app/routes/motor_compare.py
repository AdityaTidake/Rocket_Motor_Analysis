from fastapi import APIRouter, UploadFile, File
import pandas as pd
import io

router = APIRouter()

# CSV PROCESS FUNCTION
async def process_csv(file: UploadFile):
    try:
        content = await file.read()

        # ---- 1. Handle encoding safely ----
        try:
            text = content.decode("utf-8")
        except UnicodeDecodeError:
            text = content.decode("latin-1")

        lines = text.splitlines()

        # ---- 2. Find actual data start (time, thrust row) ----
        start_idx = None
        for i, line in enumerate(lines):
            if "time" in line.lower() and "thrust" in line.lower():
                start_idx = i
                break

        if start_idx is None:
            raise ValueError("Could not find 'time' and 'thrust' header row")

        # ---- 3. Read only data part ----
        df = pd.read_csv(
            io.StringIO("\n".join(lines[start_idx:])),
            sep=None,              # auto-detect separator (comma/tab/space)
            engine="python"
        )

        # ---- 4. Normalize columns ----
        df.columns = [c.strip().lower().replace(" ", "") for c in df.columns]

        # ---- 5. Flexible column mapping ----
        col_map = {}
        for col in df.columns:
            if "time" in col:
                col_map["time"] = col
            elif "thrust" in col or "force" in col:
                col_map["thrust"] = col

        if "time" not in col_map or "thrust" not in col_map:
            raise ValueError(f"Detected columns: {list(df.columns)}")

        df["time"] = df[col_map["time"]]
        df["thrust"] = df[col_map["thrust"]]

        # ---- 6. Keep only required columns ----
        df = df[["time", "thrust"]]

        # ---- 7. Convert to numeric (IMPORTANT) ----
        df["time"] = pd.to_numeric(df["time"], errors="coerce")
        df["thrust"] = pd.to_numeric(df["thrust"], errors="coerce")

        df = df.dropna()

        return df

    except Exception as e:
        raise ValueError(f"CSV Processing Error: {str(e)}")
    
#  METRICS FUNCTION
def compute_metrics(df):
    return {
        "max_thrust": float(df["thrust"].max()),
        "total_impulse": float(df["thrust"].sum()),
        "burn_time": float(df["time"].max())

        
    }


# MAIN API
@router.post("/compare-motors/")
async def compare_motors(
    motor1: UploadFile = File(...),
    motor2: UploadFile = File(...)
):
    try:
        df1 = await process_csv(motor1)
        df2 = await process_csv(motor2)

        metrics1 = compute_metrics(df1)
        metrics2 = compute_metrics(df2)

        return {
            "motor1": {
                "time": df1["time"].tolist(),
                "thrust": df1["thrust"].tolist(),
                "metrics": metrics1
            },
            "motor2": {
                "time": df2["time"].tolist(),
                "thrust": df2["thrust"].tolist(),
                "metrics": metrics2
            }
        }

    except Exception as e:
        return {"error": str(e)}