import { NavLink } from "react-router";
import HeroSectionGradientBackground from "@/components/ui/Hero";
import IconSectionSolidIconWithHoverEffect from "@/components/ui/IconSection";
export default function Home() {
	return (
		<>
			<div className="flex flex-col items-center justify-center">
				<HeroSectionGradientBackground />
				<div className="flex justify-center items-center ">
					<div className=" w-2/5 text-5xl p-16 flex  justify-center">
						<h2 className="text-[50] font-bold text-center ">
							What is <br />
							<span className="text-yellow-400 text-[60px] ">
								LIME ?{" "}
							</span>
						</h2>
					</div>
					<div className="  w-3/5 p-16">
						<p className=" text-xl font text-center">
							LIME (Local Interpretable Model-agnostic
							Explanations) is a popular XAI technique that
							explains predictions of machine learning models by
							approximating them locally with simpler,
							interpretable models. It works by perturbing input
							data, observing changes in the model's output, and
							identifying the key features driving a specific
							prediction. LIME is model-agnostic, meaning it can
							be applied to any black-box model, making it an
							invaluable tool for understanding and trusting AI
							systems.
						</p>
					</div>
				</div>
				<IconSectionSolidIconWithHoverEffect />
			</div>
		</>
	);
}
