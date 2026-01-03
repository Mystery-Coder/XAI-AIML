import { useState } from "react";
import { useTheme } from "@/components/ui/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle2, XCircle, Loader2 } from "lucide-react";

const url = "http://127.0.0.1:5000/predict_loan";

export default function Loan() {
	const [formData, setFormData] = useState({
		loan_amnt: "",
		term: "",
		int_rate: "",
		funded_amnt_inv: "",
		dti: "",
		tot_coll_amnt: "",
		revol_bal: "",
		collection_recovery_fee: "",
		revol_util: "",
		total_cur_bal: "",
		last_week_pay: "",
		delinq_2yrs: "",
		inq_last_6mths: "",
		open_acc: "",
		total_acc: "",
	});

	const [prediction, setPrediction] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { theme } = useTheme();
	const isDarkMode = theme === "dark";

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
		if (prediction !== null) {
			setPrediction(null);
		}
		if (error) {
			setError(null);
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setLoading(true);
		setError(null);
		setPrediction(null);

		const numericData = {};
		for (const key in formData) {
			const value = parseFloat(formData[key]);
			if (isNaN(value) || formData[key] === "") {
				setError(
					`Please enter a valid number for ${key.replace(/_/g, " ")}`
				);
				setLoading(false);
				return;
			}
			numericData[key] = value;
		}

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
		} catch (err) {
			setError(
				err.message ||
					"Failed to get prediction. Please check if the Flask server is running."
			);
			console.error("Error:", err);
		} finally {
			setLoading(false);
		}
	};

	const fieldLabels = {
		loan_amnt: "Loan Amount ($)",
		term: "Loan Term (months)",
		int_rate: "Interest Rate (%)",
		funded_amnt_inv: "Funded Amount by Investor ($)",
		dti: "Debt-to-Income Ratio",
		tot_coll_amnt: "Total Collection Amount ($)",
		revol_bal: "Revolving Balance ($)",
		collection_recovery_fee: "Collection Recovery Fee ($)",
		revol_util: "Revolving Utilization Rate (%)",
		total_cur_bal: "Total Current Balance ($)",
		last_week_pay: "Last Week Payment ($)",
		delinq_2yrs: "Delinquencies in Last 2 Years",
		inq_last_6mths: "Credit Inquiries in Last 6 Months",
		open_acc: "Number of Open Accounts",
		total_acc: "Total Number of Accounts",
	};

	const fieldDescriptions = {
		loan_amnt: "The total amount of the loan requested",
		term: "Number of months to repay the loan (typically 36 or 60)",
		int_rate: "Annual interest rate percentage",
		funded_amnt_inv: "Total amount funded by investors",
		dti: "Monthly debt payments divided by monthly gross income",
		tot_coll_amnt: "Total collection amounts ever owed",
		revol_bal: "Total credit revolving balance",
		collection_recovery_fee: "Post charge-off collection fee",
		revol_util: "Amount of credit used relative to credit available",
		total_cur_bal: "Total current balance across all accounts",
		last_week_pay: "Payment amount in the last week",
		delinq_2yrs: "Number of times borrower has been 30+ days past due",
		inq_last_6mths: "Number of credit inquiries in past 6 months",
		open_acc: "Number of open credit lines",
		total_acc: "Total number of credit accounts",
	};

	return (
		<div
			className={`min-h-screen py-12 px-4 ${
				isDarkMode
					? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
					: "bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100"
			}`}
		>
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-8">
					<h1
						className={`text-4xl md:text-5xl font-bold mb-4 ${
							isDarkMode ? "text-white" : "text-gray-900"
						}`}
					>
						Loan Default Prediction
					</h1>
					<p
						className={`text-lg md:text-xl max-w-3xl mx-auto ${
							isDarkMode ? "text-gray-300" : "text-gray-600"
						}`}
					>
						Predict whether a loan will default using our trained
						Logistic Regression model. Enter the loan and borrower
						information below to get a prediction.
					</p>
				</div>

				<div
					className={`rounded-2xl shadow-2xl p-6 md:p-8 ${
						isDarkMode
							? "bg-gray-800 border border-gray-700"
							: "bg-white border border-gray-200"
					}`}
				>
					<form onSubmit={handleSubmit}>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{Object.keys(formData).map((field) => (
								<div key={field} className="space-y-2">
									<Label
										htmlFor={field}
										className={
											isDarkMode
												? "text-gray-200"
												: "text-gray-700"
										}
									>
										{fieldLabels[field]}
									</Label>
									<Input
										id={field}
										name={field}
										type="number"
										step="any"
										value={formData[field]}
										onChange={handleChange}
										required
										className={`${
											isDarkMode
												? "bg-gray-900 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500"
												: "bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
										}`}
										placeholder={`Enter ${fieldLabels[
											field
										].toLowerCase()}`}
									/>
									<p
										className={`text-xs ${
											isDarkMode
												? "text-gray-400"
												: "text-gray-500"
										}`}
									>
										{fieldDescriptions[field]}
									</p>
								</div>
							))}
						</div>

						<div className="flex justify-center mt-8">
							<Button
								type="submit"
								disabled={loading}
								size="lg"
								className="px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
							>
								{loading ? (
									<>
										<Loader2 className="mr-2 h-5 w-5 animate-spin" />
										Predicting...
									</>
								) : (
									<>
										Predict Loan Default
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
								prediction === 0
									? isDarkMode
										? "bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-700"
										: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-300"
									: isDarkMode
									? "bg-gradient-to-br from-red-900/30 to-rose-900/30 border-red-700"
									: "bg-gradient-to-br from-red-50 to-rose-50 border-red-300"
							}`}
						>
							<div className="text-center">
								{prediction === 0 ? (
									<>
										<CheckCircle2
											className={`mx-auto mb-4 h-16 w-16 ${
												isDarkMode
													? "text-green-400"
													: "text-green-600"
											}`}
										/>
										<h3
											className={`text-3xl font-bold mb-2 ${
												isDarkMode
													? "text-green-300"
													: "text-green-700"
											}`}
										>
											Loan Approved
										</h3>
										<p
											className={`text-lg ${
												isDarkMode
													? "text-green-200"
													: "text-green-600"
											}`}
										>
											The model predicts this loan will
											NOT default. The loan is considered
											safe.
										</p>
									</>
								) : (
									<>
										<XCircle
											className={`mx-auto mb-4 h-16 w-16 ${
												isDarkMode
													? "text-red-400"
													: "text-red-600"
											}`}
										/>
										<h3
											className={`text-3xl font-bold mb-2 ${
												isDarkMode
													? "text-red-300"
													: "text-red-700"
											}`}
										>
											Loan High Risk
										</h3>
										<p
											className={`text-lg ${
												isDarkMode
													? "text-red-200"
													: "text-red-600"
											}`}
										>
											The model predicts this loan will
											DEFAULT. Consider additional risk
											assessment.
										</p>
									</>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
