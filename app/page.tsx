"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();

	const handleBookNow = () => {
		router.push("/book");
	};

	return (
		<div className='min-h-screen flex flex-col'>
			<main className='flex-grow flex flex-col items-center justify-center p-8'>
				<h1 className='text-4xl font-bold mb-6'>Welcome to BookMeUp</h1>
				<Button
					variant='outline'
					size='lg'
					onClick={handleBookNow}>
					Book Now
				</Button>
			</main>
		</div>
	);
}
