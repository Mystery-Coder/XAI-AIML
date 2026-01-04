import shap  #type:ignore
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import base64
import numpy as np
from io import BytesIO 
import warnings

# Suppress warnings
warnings.filterwarnings('ignore', category=UserWarning)
warnings.filterwarnings('ignore', category=RuntimeWarning)

def generate_shap_plot(model, input_df, feature_names):

    input_scaled = input_df.values
    
    # Create a diverse background dataset (varied samples around the input)
    print("Computing SHAP values...")
    np.random.seed(42)
    background = np.zeros((50, 6))
    
    # Create variations: some higher, some lower, some random
    for i in range(50):
        noise = np.random.normal(0, 0.3, 6)  # Add random noise
        background[i] = input_scaled[0] + noise
    
    # Try multiple explainer types for robustness
    try:
        # Try Gradient-based explainer first (fastest for neural networks)
        explainer = shap.GradientExplainer(model, background)
        shap_values = explainer.shap_values(input_scaled)
        print("Using GradientExplainer")
    except Exception as e:
        print(f"GradientExplainer failed: {e}, trying DeepExplainer")
        try:
            # Fallback to DeepExplainer
            explainer = shap.DeepExplainer(model, background)
            shap_values = explainer.shap_values(input_scaled)
            print("Using DeepExplainer")
        except Exception as e2:
            print(f"DeepExplainer failed: {e2}, using KernelExplainer")
            # Final fallback to KernelExplainer (slowest but most reliable)
            explainer = shap.KernelExplainer(
                lambda x: model.predict(x, verbose=0),
                background
            )
            shap_values = explainer.shap_values(input_scaled, nsamples=200)
            print("Using KernelExplainer")
    
    # Handle SHAP values structure (different explainers return different formats)
    if isinstance(shap_values, list):
        if len(shap_values) > 0:
            shap_vals_single = shap_values[0][0]
        else:
            shap_vals_single = shap_values[0]
    else:
        shap_vals_single = shap_values[0]
    
    # Ensure it's 1D array with correct shape
    if len(shap_vals_single.shape) > 1:
        shap_vals_single = shap_vals_single.flatten()
    
    input_single = input_df.values[0]
    
    print(f"SHAP values: {shap_vals_single}")
    print(f"Sum of absolute SHAP values: {np.abs(shap_vals_single).sum()}")
    print(f"SHAP values shape: {shap_vals_single.shape}")
    print(f"Input shape: {input_single.shape}")
    print(f"Features length: {len(feature_names)}")
    
    # Generate SHAP bar plot (clearer than force plot)
    print("Generating SHAP plot...")
    plt.close('all')
    fig, ax = plt.subplots(figsize=(10, 6))
    plt.ioff()
    # Create bar plot showing feature contributions
    colors = ['red' if x > 0 else 'blue' for x in shap_vals_single]
    bars = ax.barh(feature_names, shap_vals_single, color=colors, alpha=0.7)
    
    ax.set_xlabel('SHAP Value (Impact on Prediction)', fontsize=12, fontweight='bold')
    ax.set_title('Feature Contribution to Price Prediction', fontsize=14, fontweight='bold')
    ax.axvline(x=0, color='black', linestyle='-', linewidth=0.8)
    ax.grid(axis='x', alpha=0.3)
    
    # Add value labels on bars
    for i, (bar, val) in enumerate(zip(bars, shap_vals_single)):
        label_x = val + (0.01 if val > 0 else -0.01)
        align = 'left' if val > 0 else 'right'
        ax.text(label_x, i, f'{val:.3f}', 
               va='center', ha=align, fontsize=10, fontweight='bold')
    
    plt.tight_layout()
    
    # Convert plot to base64
    buffer = BytesIO()
    plt.savefig(buffer, format='png', bbox_inches='tight', dpi=100)
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.read()).decode('utf-8')
    buffer.close()
    plt.close(fig)
    plt.close('all')
    print("SHAP plot generated successfully!")
    
    return image_base64