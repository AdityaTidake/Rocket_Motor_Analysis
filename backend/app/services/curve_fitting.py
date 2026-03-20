# import numpy as np
# def polynomial_fit(time, thrust):
#     coeff = np.polyfit(time, thrust,2)
#     a,b,c = coeff
#     equation = f"y = {a:.3f}x^2 + {b:.3f}x + {c:.3f}" 
#     return equation, coeff
 


import numpy as np
from scipy.optimize import curve_fit

# Linear model 
# y = ax+b

def linear_func(x,a,b):
    return a*x+b 

# Quadratic model
# y = ax^2 + bx + c
def quad_func(x,a,b,c):
    return a*x**2 + b*x + c

# Sinusoildal model
# y = a*sin(bx+c)  
def sin_func(x,a,b,c):
    return a*np.sin(b*x+c)

# Mean squared error
def mse(actual, predicted):
    return np.mean((actual-predicted)**2)  

def best_fit_curve(time, thrust):
    x = np.array(time)
    y = np.array(thrust)

    results = {}

    # Linear fit
    try: 
        params, _ = curve_fit(linear_func, x,y)
        pred = linear_func(x, *params)
        error = mse(y, pred)

        equation = f"y = {params[0]:.3f}x + {params[1]:.3f}"

        results["linear"] = {
            "error": error,
            "equation": equation,
            "curve": np.round(pred,3).tolist()
        
        }
    except:
        pass

    # Quadratic fit
    try:
        params = np.polyfit(x,y,2)
        pred = np.polyval(params, x)
        error = mse(y,pred)

        equation = f"y = {params[0]:.3f}x^2 + {params[1]:.3f}x + {params[2]:.3f}"

        results["quadratic"] = {
            "error": error,
            "equation": equation, 
            "curve": np.round(pred,3).tolist()
        }
    except:
        pass

    # Sinusoidal fit
    try:
        params, _ = curve_fit(sin_func, x,y, maxfev = 10000)
        pred = sin_func(x, *params)
        error = mse(y,pred)
        equation = f"y = {params[0]:.3f}sin({params[1]:.3f}x + {params[2]:.3f})"

        results["sinusoidal"] = {
            "error": error,
            "equation": equation, 
            "curve": np.round(pred,3).tolist()
        }
    except:
        pass

    # select best model
    best_model = min(results, key = lambda k: results[k]["error"])

    return {
        "best_model": best_model,
        "equation": results[best_model]["equation"],
        "ideal_curve": results[best_model]["curve"] 
    }
