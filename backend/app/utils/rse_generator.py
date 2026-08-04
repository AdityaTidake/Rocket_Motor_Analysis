import pandas as pd

def generate_rse_from_df(df, output_path):

    # Validate columns
    if "time" not in df.columns or "thrust" not in df.columns:
        raise ValueError("CSV must contain 'time' and 'thrust' columns")

    # Clean data
    df["time"] = pd.to_numeric(df["time"], errors="coerce")
    df["thrust"] = pd.to_numeric(df["thrust"], errors="coerce")
    df = df.dropna()

    # Write RSE XML
    with open(output_path, "w") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write('<engine-database>\n')
        f.write('  <engine-list>\n')
        f.write('    <engine mfg="Custom" code="MyMotor" Type="reloadable" ')
        f.write('dia="24" len="100" initWt="0.05" propWt="0.02">\n')
        f.write('      <data>\n')

        for _, row in df.iterrows():
            f.write(f'        <eng-data t="{row["time"]}" f="{row["thrust"]}"/>\n')

        f.write('      </data>\n')
        f.write('    </engine>\n')
        f.write('  </engine-list>\n')
        f.write('</engine-database>\n')

    print("🚀 RSE generated:", output_path)