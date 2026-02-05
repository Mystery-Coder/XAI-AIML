import { Button } from "@/components/ui/button";

export default function HeroSectionGradientBackground() {
	return (
		<>
			{/* Hero */}
			<div className="relative overflow-hidden py-24 lg:py-32">
				{/* Gradients */}
				<div
					aria-hidden="true"
					className="flex absolute -top-96 start-1/2 transform -translate-x-1/2"
				>
					<div className="bg-gradient-to-r from-background/50 to-background blur-3xl w-full h-[44rem] rotate-[-60deg] transform -translate-x-[10rem]" />
					<div className="bg-gradient-to-tl blur-3xl w-full h-[50rem] rounded-full origin-top-left -rotate-12 -translate-x-[15rem] from-primary-foreground via-primary-foreground to-background" />
				</div>
				{/* End Gradients */}
				<div className="relative z-10">
					<div className="container py-10 lg:py-16">
						<div className="max-w-2xl text-center mx-auto">
							{/* Title */}
							<div className="mt-5 max-w-2xl">
								<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
									Explaining Predictions Of Financial Models
									Using XAI
								</h1>
							</div>
							{/* End Title */}
							<div className="mt-5 max-w-3xl">
								<p className="text-xl text-muted-foreground">
									This project leverages Explainable AI (XAI)
									techniques to provide insights into the
									predictions of financial models. By
									integrating the LIME (Local Interpretable
									Model-agnostic Explanations) framework, we
									demystify how machine learning models make
									decisions in three critical financial
									domains
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* End Hero */}
		</>
	);
}
