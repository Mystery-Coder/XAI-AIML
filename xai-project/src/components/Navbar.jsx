import React from "react";
import { Link, NavLink } from "react-router";
import { Button } from "./ui/button";
import { ModeToggle } from "./ui/mode-toggle";
import { FaGithub } from "react-icons/fa";

const Navbar = () => {
	return (
		<div className="bg-gray-800 shadow-lg sticky top-0 backdrop-blur-md bg-opacity-50 min-h-[60px] w-full z-50">
			<nav className="container mx-auto px-4">
				<div className="flex justify-between items-center h-[60px]">
					<Button asChild className="text-xl ">
						<NavLink to={"/"}>XAI Project</NavLink>
					</Button>
					<div className="flex items-center space-x-4">
						<a
							href="https://github.com/Mystery-Coder/XAI-AIML"
							target="_blank"
							rel="noopener noreferrer"
							className="text-white hover:text-gray-300"
						>
							<FaGithub size={24} />
						</a>
						<ModeToggle />
					</div>
				</div>
			</nav>
			<div className="h-[0.75px] opacity-50 w-[90%] m-auto bg-white"></div>
		</div>
	);
};

export default Navbar;
