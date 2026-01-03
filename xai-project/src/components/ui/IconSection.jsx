import {
    House,
    IndianRupee,
    ChartNoAxesCombined,
    ChevronRightIcon
} from "lucide-react";
import React from "react";
import { NavLink } from "react-router";
export default function IconSectionSolidIconWithHoverEffect() {
    return (
        <>
            {/* Icon Blocks */}
            <div className="container py-24 lg:py-32">
                <div className="flex flex-wrap">
                    {/* Icon Block */}
                    <a
                        className="group flex flex-col justify-between hover:bg-primary-foreground/90 rounded-lg p-4 md:p-7 w-full md:w-1/3 h-80"
                        href="#"
                    >
                        <div className="flex justify-center items-center w-12 bg-primary h-12 border rounded-lg">
                            <IndianRupee className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
                        </div>
                        <div className="mt-5 flex-grow">
                            <h3 className="text-lg font-semibold">Loan Default Prediction</h3>
                            <p className="mt-1 text-muted-foreground">
                                Many Financial Institutions are showing a trend of
                                using models to assess a person's loan risk
                            </p>
                        </div>
                        <span className="mt-2 inline-flex items-center gap-x-1.5 text-sm decoration-2 group-hover:underline font-medium">
                            <NavLink to={"/loan"}>Try it Out</NavLink>
                            <ChevronRightIcon className="flex-shrink-0 w-4 h-4" />
                        </span>
                    </a>
                    {/* End Icon Block */}
                    {/* Icon Block */}
                    <a
                        className="group flex flex-col justify-between hover:bg-primary-foreground/90 rounded-lg p-4 md:p-7 w-full md:w-1/3 h-80"
                        href="#"
                    >
                        <div className="flex justify-center items-center w-12 bg-primary h-12 border rounded-lg">
                            <House className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
                        </div>
                        <div className="mt-5 flex-grow">
                            <h3 className="text-lg font-semibold">Property Valuation</h3>
                            <p className="mt-1 text-muted-foreground">
                                The price of properties has been very hard to
                                valuate objectly, hence such ML models are applied
                                to provide a level consistency
                            </p>
                        </div>
                        <span className="mt-2 inline-flex items-center gap-x-1.5 text-sm decoration-2 group-hover:underline font-medium">
                            <NavLink to={"/property"}>Try it Out</NavLink>
                            <ChevronRightIcon className="flex-shrink-0 w-4 h-4" />
                        </span>
                    </a>
                    {/* End Icon Block */}
                    {/* Icon Block */}
                    <div
                        className="group flex flex-col justify-between hover:bg-primary-foreground/90 rounded-lg p-4 md:p-7 w-full md:w-1/3 h-80"
                        to={"/stock"}
                    >
                        <div className="flex justify-center items-center w-12 bg-primary h-12 border rounded-lg">
                            <ChartNoAxesCombined className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
                        </div>
                        <div className="mt-5 flex-grow">
                            <h3 className="text-lg font-semibold"> Stock Price Prediction </h3>
                            <p className="mt-1 text-muted-foreground">
                                Gain transparency into the variables driving stock
                                movement forecasts. Explore model predictions, visualize contributing
                                factors, and trust AI-driven financial decisions
                                more effectively
                            </p>
                        </div>
                        <span className="mt-2 inline-flex items-center gap-x-1.5 text-sm decoration-2 group-hover:underline font-medium">
                            <NavLink to="/stock">Try it Out</NavLink>
                            <ChevronRightIcon className="flex-shrink-0 w-4 h-4" />
                        </span>
                    </div>
                    {/* End Icon Block */}
                </div>
            </div>
            {/* End Icon Blocks */}
        </>
    );
}
