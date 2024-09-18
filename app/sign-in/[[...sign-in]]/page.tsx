import { SignIn } from "@clerk/nextjs";

export default function Page() {
	return (
		<div className='flex justify-center items-center'>
			<SignIn
				appearance={{
					variables: {
						colorBackground: "#af89c9",
						colorInputText: "black",
						colorText: "white",
					},
					elements: {
						socialButtons: "bg-white border rounded-lg",
					},
				}}
			/>
		</div>
	);
}
