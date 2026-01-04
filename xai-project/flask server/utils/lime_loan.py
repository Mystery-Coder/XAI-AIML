import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import base64
from io import BytesIO
from lime.lime_tabular import LimeTabularExplainer #type:ignore


def generate_loan_lime_plot(
    model,
    training_data,
    input_array,
    feature_names
):
    """
    LIME explanation for loan approval (Logistic Regression)
    """

    explainer = LimeTabularExplainer(
        training_data,
        feature_names=feature_names,
        class_names=["Rejected", "Approved"],
        mode="classification",
        discretize_continuous=True
    )

    explanation = explainer.explain_instance(
        input_array[0],
        model.predict_proba,
        num_features=len(feature_names)
    )

    fig = explanation.as_pyplot_figure(label=1)
    plt.title("LIME Explanation – Loan Approval Decision", fontsize=14, fontweight="bold")
    plt.tight_layout()

    buffer = BytesIO()
    plt.savefig(buffer, format="png", bbox_inches="tight", dpi=100)
    buffer.seek(0)

    lime_image = base64.b64encode(buffer.read()).decode("utf-8")
    buffer.close()
    plt.close(fig)

    return lime_image
