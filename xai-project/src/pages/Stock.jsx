// import { useState } from "react";

// const Stock = () => {
//   const [formData, setFormData] = useState({
//     open: "",
//     high: "",
//     low: "",
//     volume: "",
//     change: "",
//     prev_price: ""
//   });

//   const [prediction, setPrediction] = useState(null);
//   const [shapPlot, setShapPlot] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const response = await fetch("http://127.0.0.1:5000/predict_stock", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         open: parseFloat(formData.open),
//         high: parseFloat(formData.high),
//         low: parseFloat(formData.low),
//         volume: parseFloat(formData.volume),
//         change: parseFloat(formData.change),
//         prev_price: parseFloat(formData.prev_price)
//       })
//     });

//     const data = await response.json();
//     setPrediction(data.prediction);
//     setShapPlot(data.shap_plot);
//     setLoading(false);
//   };

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h2>Stock Price Prediction (Explainable AI)</h2>

//       <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem", maxWidth: "500px" }}>
//         <input name="open" placeholder="Open Price" onChange={handleChange} required />
//         <input name="high" placeholder="High Price" onChange={handleChange} required />
//         <input name="low" placeholder="Low Price" onChange={handleChange} required />
//         <input name="volume" placeholder="Volume (Millions)" onChange={handleChange} required />
//         <input name="change" placeholder="Daily Change" onChange={handleChange} required />
//         <input name="prev_price" placeholder="Previous Day Price" onChange={handleChange} required />

//         <button type="submit">
//           {loading ? "Predicting..." : "Predict & Explain"}
//         </button>
//       </form>

//       {prediction && (
//         <h3 style={{ marginTop: "1.5rem", color: "green" }}>
//            Predicted Price: ${prediction}
//         </h3>
//       )}

//       {shapPlot && (
//         <div style={{ marginTop: "2rem" }}>
//           <h3>SHAP Explanation</h3>
//           <img
//             src={`data:image/png;base64,${shapPlot}`}
//             alt="SHAP Explanation"
//             style={{ width: "100%", maxWidth: "700px" }}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Stock;

import { useState } from "react";
import { useTheme } from "@/components/ui/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, Loader2, TrendingUp, BarChart3 } from "lucide-react";

const url = "http://127.0.0.1:5000/predict_stock";

export default function Stock() {
    const [formData, setFormData] = useState({
        open: "",
        high: "",
        low: "",
        volume: "",
        change: "",
        prev_price: ""
    });

    const [prediction, setPrediction] = useState(null);
    const [shapPlot, setShapPlot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { theme } = useTheme();
    const isDarkMode = theme === "dark";

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        if (prediction !== null) {
            setPrediction(null);
        }
        if (shapPlot) setShapPlot(null);
        if (error) {
            setError(null);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setPrediction(null);

        const numericData = {
            open: parseFloat(formData.open),
            high: parseFloat(formData.high),
            low: parseFloat(formData.low),
            volume: parseFloat(formData.volume),
            change: parseFloat(formData.change),
            prev_price: parseFloat(formData.prev_price)
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(numericData),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const result = await response.json();
            setPrediction(result.prediction);
            setShapPlot(result.shap_plot);
        } catch (err) {
            setError(err.message || "Failed to get prediction. Please check if the Flask server is running.");
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`min-h-screen py-12 px-4 ${
                isDarkMode
                    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
                    : "bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100"
            }`}
        >
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                    <h1
                        className={`text-4xl md:text-5xl font-bold mb-4 ${
                            isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                    >
                        Stock Price Prediction
                    </h1>
                    <p
                        className={`text-lg md:text-xl max-w-3xl mx-auto ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                    >
                        We have trained a machine learning model to predict stock prices using key features such as opening price, high, low, volume, daily change, and previous day's closing price with explainable AI insights.
                    </p>
                </div>

                <div
                    className={`rounded-2xl shadow-2xl p-6 md:p-8 ${
                        isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                    }`}
                >
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Open Price */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="open"
                                    className={isDarkMode ? "text-gray-200" : "text-gray-700"}
                                >
                                    Open Price
                                </Label>
                                <Input
                                    id="open"
                                    name="open"
                                    type="number"
                                    step="any"
                                    value={formData.open}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    className={`${
                                        isDarkMode
                                            ? "bg-gray-900 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500"
                                            : "bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
                                    }`}
                                    placeholder="Enter opening price"
                                />
                            </div>

                            {/* High Price */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="high"
                                    className={isDarkMode ? "text-gray-200" : "text-gray-700"}
                                >
                                    High Price
                                </Label>
                                <Input
                                    id="high"
                                    name="high"
                                    type="number"
                                    step="any"
                                    value={formData.high}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    className={`${
                                        isDarkMode
                                            ? "bg-gray-900 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500"
                                            : "bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
                                    }`}
                                    placeholder="Enter high price"
                                />
                            </div>

                            {/* Low Price */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="low"
                                    className={isDarkMode ? "text-gray-200" : "text-gray-700"}
                                >
                                    Low Price
                                </Label>
                                <Input
                                    id="low"
                                    name="low"
                                    type="number"
                                    step="any"
                                    value={formData.low}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    className={`${
                                        isDarkMode
                                            ? "bg-gray-900 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500"
                                            : "bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
                                    }`}
                                    placeholder="Enter low price"
                                />
                            </div>

                            {/* Volume */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="volume"
                                    className={isDarkMode ? "text-gray-200" : "text-gray-700"}
                                >
                                    Volume (Millions)
                                </Label>
                                <Input
                                    id="volume"
                                    name="volume"
                                    type="number"
                                    step="any"
                                    value={formData.volume}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    className={`${
                                        isDarkMode
                                            ? "bg-gray-900 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500"
                                            : "bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
                                    }`}
                                    placeholder="Enter volume"
                                />
                            </div>

                            {/* Daily Change */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="change"
                                    className={isDarkMode ? "text-gray-200" : "text-gray-700"}
                                >
                                    Daily Change
                                </Label>
                                <Input
                                    id="change"
                                    name="change"
                                    type="number"
                                    step="any"
                                    value={formData.change}
                                    onChange={handleInputChange}
                                    required
                                    className={`${
                                        isDarkMode
                                            ? "bg-gray-900 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500"
                                            : "bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
                                    }`}
                                    placeholder="Enter daily change"
                                />
                            </div>

                            {/* Previous Day Price */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="prev_price"
                                    className={isDarkMode ? "text-gray-200" : "text-gray-700"}
                                >
                                    Previous Day Price
                                </Label>
                                <Input
                                    id="prev_price"
                                    name="prev_price"
                                    type="number"
                                    step="any"
                                    value={formData.prev_price}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    className={`${
                                        isDarkMode
                                            ? "bg-gray-900 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500"
                                            : "bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
                                    }`}
                                    placeholder="Enter previous day price"
                                />
                            </div>
                        </div>

                        <div className="flex justify-center mt-8">
                            <Button
                                type="submit"
                                disabled={loading}
                                size="lg"
                                className="px-8 py-6 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Predicting...
                                    </>
                                ) : (
                                    <>
                                        Predict & Explain
                                        <Send className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>

                    {error && (
                        <div
                            className={`mt-6 p-4 rounded-lg border ${
                                isDarkMode
                                    ? "bg-red-900/20 border-red-800 text-red-200"
                                    : "bg-red-50 border-red-200 text-red-800"
                            }`}
                        >
                            <p className="font-medium">Error: {error}</p>
                        </div>
                    )}

                    {prediction !== null && (
                        <div
                            className={`mt-6 p-8 rounded-2xl border-2 ${
                                isDarkMode
                                    ? "bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border-blue-700"
                                    : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300"
                            }`}
                        >
                            <div className="text-center">
                                <BarChart3
                                    className={`mx-auto mb-4 h-16 w-16 ${
                                        isDarkMode ? "text-blue-400" : "text-blue-600"
                                    }`}
                                />
                                <h3
                                    className={`text-2xl font-bold mb-4 ${
                                        isDarkMode ? "text-blue-300" : "text-blue-700"
                                    }`}
                                >
                                    Predicted Stock Price
                                </h3>
                                <div className="flex items-center justify-center gap-3">
                                    <TrendingUp
                                        className={`h-8 w-8 ${
                                            isDarkMode ? "text-blue-400" : "text-blue-600"
                                        }`}
                                    />
                                    <p
                                        className={`text-4xl md:text-5xl font-bold ${
                                            isDarkMode ? "text-blue-200" : "text-blue-700"
                                        }`}
                                    >
                                        ${parseFloat(prediction).toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </p>
                                </div>
                                <p
                                    className={`mt-4 text-lg ${
                                        isDarkMode ? "text-blue-200" : "text-blue-600"
                                    }`}
                                >
                                    Based on the provided stock data
                                </p>
                            </div>
                        </div>
                    )}

                    {shapPlot && (
                        <div
                            className={`mt-8 p-6 rounded-2xl border ${
                                isDarkMode
                                    ? "bg-gray-900 border-gray-700"
                                    : "bg-white border-gray-300"
                            }`}
                        >
                            <h3
                                className={`text-2xl font-bold mb-4 text-center ${
                                    isDarkMode ? "text-green-300" : "text-green-700"
                                }`}
                            >
                                SHAP Explanation — Feature Contribution
                            </h3>

                            <p
                                className={`text-center mb-6 ${
                                    isDarkMode ? "text-gray-300" : "text-gray-600"
                                }`}
                            >
                                This plot explains how each feature contributed to the predicted
                                stock price.
                            </p>

                            <div className="flex justify-center">
                                <img
                                    src={`data:image/png;base64,${shapPlot}`}
                                    alt="SHAP Explanation"
                                    className="max-w-full rounded-xl shadow-lg border"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}