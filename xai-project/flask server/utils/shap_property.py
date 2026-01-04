import shap #type:ignore
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import base64
import numpy as np
from io import BytesIO
import warnings

warnings.filterwarnings("ignore")


def generate_property_shap_plot(model, input_array, feature_names):
    """
    SHAP explanation for RandomForestRegressor
    input_array: shape (1, n_features)
    """

    input_array = np.array(input_array)

    print("Using TreeExplainer for Property Model (RandomForest)")

    # ---- TreeExplainer (CORRECT for RandomForest) ----
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(input_array)

    # For regression, shap_values shape = (1, n_features)
    shap_vals_single = shap_values[0]

    print("SHAP values shape:", shap_vals_single.shape)
    print("Feature count:", len(feature_names))

    # ---- BAR PLOT (same style as stock) ----
    plt.close("all")
    fig, ax = plt.subplots(figsize=(10, 7))
    plt.ioff()

    colors = ["red" if x > 0 else "blue" for x in shap_vals_single]
    bars = ax.barh(feature_names, shap_vals_single, color=colors, alpha=0.7)

    ax.set_xlabel("SHAP Value (Impact on Property Price)", fontsize=12, fontweight="bold")
    ax.set_title("Property Price Prediction – Feature Contribution", fontsize=14, fontweight="bold")
    ax.axvline(x=0, color="black", linewidth=0.8)
    ax.grid(axis="x", alpha=0.3)

    for i, (bar, val) in enumerate(zip(bars, shap_vals_single)):
        align = "left" if val > 0 else "right"
        offset = 0.01 if val > 0 else -0.01
        ax.text(val + offset, i, f"{val:.2f}", va="center", ha=align, fontsize=9)

    plt.tight_layout()

    # ---- Convert to base64 ----
    buffer = BytesIO()
    plt.savefig(buffer, format="png", bbox_inches="tight", dpi=100)
    buffer.seek(0)

    image_base64 = base64.b64encode(buffer.read()).decode("utf-8")
    buffer.close()
    plt.close(fig)

    print("Property SHAP plot generated successfully!")

    return image_base64
