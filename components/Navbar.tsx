import React from "react";
import Link from "next/link";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

export function Navbar() {
	return (
		<nav className='flex justify-between items-center py-4 px-6 shadow-sm'>
			<Link
				href='/'
				className='text-xl font-bold'>
				Logo
			</Link>

			<SignedOut>
				<SignInButton>
					<Button variant={"outline"}>Sign In</Button>
				</SignInButton>
			</SignedOut>

			<SignedIn>
				<UserButton
					showName
					userProfileMode='modal'
					appearance={{
						variables: {
							colorText: "white",
							colorBackground: "#af89c9",
							colorInputText: "white",
							colorTextOnPrimaryBackground: "white",
							colorTextSecondary: "white",
						},
						elements: {
							userButtonPopoverActionButton: "text-white",
						},
					}}
				/>
			</SignedIn>
		</nav>
	);
}
