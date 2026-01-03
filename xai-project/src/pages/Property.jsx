import { useState } from "react";
import { useTheme } from "@/components/ui/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Send, Loader2, Home, TrendingUp } from "lucide-react";

const url = "http://127.0.0.1:5000/predict_property";

export default function Property() {
    const [formData, setFormData] = useState({
        posted_by: "0",
        under_construction: "0",
        rera: "0",
        bhk: "1",
        square_feet: "1000",
        ready_to_move: "0",
        resale: "0",
        city: "Bangalore",
        locality: "Whitefield",
    });

    const [price, setPrice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { theme } = useTheme();
    const isDarkMode = theme === "dark";

    const handleChange = (name, value) => {
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        if (price !== null) {
            setPrice(null);
        }
        if (error) {
            setError(null);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        handleChange(name, value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setPrice(null);

        const numericData = {
            ...formData,
            posted_by: parseInt(formData.posted_by),
            under_construction: parseInt(formData.under_construction),
            rera: parseInt(formData.rera),
            bhk: parseInt(formData.bhk),
            square_feet: parseFloat(formData.square_feet),
            ready_to_move: parseInt(formData.ready_to_move),
            resale: parseInt(formData.resale),
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
            setPrice(result.prediction);
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
                        Property Valuation
                    </h1>
                    <p
                        className={`text-lg md:text-xl max-w-3xl mx-auto ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                    >
                        We have trained a Random Forest Regressor Model to predict property
                        valuations using a dataset with key features such as RERA approval,
                        location, BHK (number of bedrooms, hall, kitchen), square footage,
                        whether a property is ready to move, etc.
                    </p>
                </div>

                <div
                    className={`rounded-2xl shadow-2xl p-6 md:p-8 ${
                        isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                    }`}
                >
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Posted By */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="posted_by"
                                    className={isDarkMode ? "text-gray-200" : "text-gray-700"}
                                >
                                    Posted By
                                </Label>
                                <Select
                                    value={formData.posted_by}
                                    onValueChange={(value) => handleChange("posted_by", value)}
                                >
                                    <SelectTrigger
                                        className={`${
                                            isDarkMode
                                                ? "bg-gray-900 border-gray-600 text-white"
                                                : "bg-gray-50 border-gray-300 text-gray-900"
                                        }`}
                                    >
                                        <SelectValue placeholder="Select posting type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Owner</SelectItem>
                                        <SelectItem value="1">Dealer</SelectItem>
                                        <SelectItem value="2">Builder</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Under Construction */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="under_construction"
                                    className={isDarkMode ? "text-gray-200" : "text-gray-700"}
                                >
                                    Is the property under construction?
                                </Label>
                                <Select
                                    value={formData.under_construction}
                                    onValueChange={(value) => handleChange("under_construction", value)}
                                >
                                    <SelectTrigger
                                        className={`${
                                            isDarkMode
                                                ? "bg-gray-900 border-gray-600 text-white"
                                                : "bg-gray-50 border-gray-300 text-gray-900"
                                        }`}
                                    >
                                        <SelectValue placeholder="Select option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">No</SelectItem>
                                        <SelectItem value="1">Yes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* RERA Approved */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="rera"
                                    className={isDarkMode ? "text-gray-200" : "text-gray-700"}
                                >
                                    RERA Approved
                                </Label>
                                <Select
                                    value={formData.rera}
                                    onValueChange={(value) => handleChange("rera", value)}
                                >
                                    <SelectTrigger
                                        className={`${
                                            isDarkMode
                                                ? "bg-gray-900 border-gray-600 text-white"
                                                : "bg-gray-50 border-gray-300 text-gray-900"
                                        }`}
                                    >
                                        <SelectValue placeholder="Select option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">No</SelectItem>
                                        <SelectItem value="1">Yes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* BHK */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="bhk"
                                    className={isDarkMode ? "text-gray-200" : "text-gray-700"}
                                >
                                    Enter BHK
                                </Label>
                                <Input
                                    id="bhk"
                                    name="bhk"
                                    type="number"
                                    value={formData.bhk}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    className={`${
                                        isDarkMode
                                            ? "bg-gray-900 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500"
                                            : "bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
                                    }`}
                                    placeholder="Enter number of BHK"
                                />
                            </div>

                            {/* Square Feet */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="square_feet"
                                    className={isDarkMode ? "text-gray-200" : "text-gray-700"}
                                >
                                    Enter Square Feet
                                </Label>
                                <Input
                                    id="square_feet"
                                    name="square_feet"
                                    type="number"
                                    step="any"
                                    value={formData.square_feet}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    className={`${
                                        isDarkMode
                                            ? "bg-gray-900 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500"
                                            : "bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
                                    }`}
                                    placeholder="Enter square feet"
                                />
                            </div>

                            {/* Ready to Move */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="ready_to_move"
                                    className={isDarkMode ? "text-gray-200" : "text-gray-700"}
                                >
                                    Is it ready to move?
                                </Label>
                                <Select
                                    value={formData.ready_to_move}
                                    onValueChange={(value) => handleChange("ready_to_move", value)}
                                >
                                    <SelectTrigger
                                        className={`${
                                            isDarkMode
                                                ? "bg-gray-900 border-gray-600 text-white"
                                                : "bg-gray-50 border-gray-300 text-gray-900"
                                        }`}
                                    >
                                        <SelectValue placeholder="Select option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">No</SelectItem>
                                        <SelectItem value="1">Yes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Resale */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="resale"
                                    className={isDarkMode ? "text-gray-200" : "text-gray-700"}
                                >
                                    Is it a resale property?
                                </Label>
                                <Select
                                    value={formData.resale}
                                    onValueChange={(value) => handleChange("resale", value)}
                                >
                                    <SelectTrigger
                                        className={`${
                                            isDarkMode
                                                ? "bg-gray-900 border-gray-600 text-white"
                                                : "bg-gray-50 border-gray-300 text-gray-900"
                                        }`}
                                    >
                                        <SelectValue placeholder="Select option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">No</SelectItem>
                                        <SelectItem value="1">Yes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Locality */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="locality"
                                    className={isDarkMode ? "text-gray-200" : "text-gray-700"}
                                >
                                    Enter Locality
                                </Label>
                                <Input
                                    id="locality"
                                    name="locality"
                                    type="text"
                                    value={formData.locality}
                                    onChange={handleInputChange}
                                    required
                                    className={`${
                                        isDarkMode
                                            ? "bg-gray-900 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500"
                                            : "bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
                                    }`}
                                    placeholder="Enter locality name"
                                />
                            </div>

                            {/* City */}
                            <div className="space-y-2 md:col-span-2">
                                <Label
                                    htmlFor="city"
                                    className={isDarkMode ? "text-gray-200" : "text-gray-700"}
                                >
                                    Enter City
                                </Label>
                                <Input
                                    id="city"
                                    name="city"
                                    type="text"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                    className={`${
                                        isDarkMode
                                            ? "bg-gray-900 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500"
                                            : "bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
                                    }`}
                                    placeholder="Enter city name"
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
                                        Predict Price
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

                    {price !== null && (
                        <div
                            className={`mt-6 p-8 rounded-2xl border-2 ${
                                isDarkMode
                                    ? "bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border-blue-700"
                                    : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300"
                            }`}
                        >
                            <div className="text-center">
                                <Home
                                    className={`mx-auto mb-4 h-16 w-16 ${
                                        isDarkMode ? "text-blue-400" : "text-blue-600"
                                    }`}
                                />
                                <h3
                                    className={`text-2xl font-bold mb-4 ${
                                        isDarkMode ? "text-blue-300" : "text-blue-700"
                                    }`}
                                >
                                    Predicted Property Value
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
                                        ₹{price.toLocaleString("en-IN")} Lakh
                                    </p>
                                </div>
                                <p
                                    className={`mt-4 text-lg ${
                                        isDarkMode ? "text-blue-200" : "text-blue-600"
                                    }`}
                                >
                                    Based on the provided property details
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}