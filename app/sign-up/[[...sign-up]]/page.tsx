import { SignUp } from "@clerk/nextjs";

export default function Page() {
	return (
		<div className='flex justify-center items-center mt-2'>
			<SignUp
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
