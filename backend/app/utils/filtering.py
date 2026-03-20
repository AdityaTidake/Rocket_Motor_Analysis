def filter_range(df, min_time = None, max_time = None):

    if min_time is not None:
        df = df[df["time"]>=min_time]

    if max_time is not None:
        df = df[df["time"]<=max_time]  

    return df 