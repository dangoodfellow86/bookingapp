"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const DAYS = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];
const START_TIME = 10; // 10 AM
const END_TIME = 19; // 7 PM

export default function BookAppointment() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [date, setDate] = useState("");
	const [time, setTime] = useState("");
	const [availableSlots, setAvailableSlots] = useState<string[]>([]);

	useEffect(() => {
		if (date) {
			fetchAvailableSlots(date);
		} else {
			setAvailableSlots([]);
			setTime("");
		}
	}, [date]);

	const fetchAvailableSlots = async (selectedDate: string) => {
		console.log("Fetching available slots for date:", selectedDate);

		const dayOfWeek = new Date(selectedDate).getDay();
		console.log("Day of week:", DAYS[dayOfWeek]);

		if (dayOfWeek === 0 || dayOfWeek === 1) {
			// Sunday or Monday
			console.log("No slots available on Sunday or Monday");
			setAvailableSlots([]);
			return;
		}

		// Generate all possible time slots
		const allSlots = [];
		for (let hour = START_TIME; hour < END_TIME; hour++) {
			allSlots.push(`${hour.toString().padStart(2, "0")}:00:00`);
			allSlots.push(`${hour.toString().padStart(2, "0")}:30:00`);
		}

		console.log("All possible slots:", allSlots);

		// Fetch booked slots from Supabase
		const { data: bookedSlots, error } = await supabase
			.from("bookings")
			.select("*")
			.eq("date", selectedDate);

		if (error) {
			console.error("Error fetching booked slots:", error);
			setAvailableSlots([]);
			return;
		}

		console.log("Raw Supabase response:", bookedSlots);

		if (!bookedSlots || bookedSlots.length === 0) {
			console.log("No booked slots found for the selected date");
			setAvailableSlots(allSlots);
			return;
		}

		// Filter out booked slots
		const bookedTimes = bookedSlots.map((slot) => slot.time);
		console.log("Booked times:", bookedTimes);

		const available = allSlots.filter((slot) => {
			const isAvailable = !bookedTimes.includes(slot);
			console.log(`Slot ${slot} is available: ${isAvailable}`);
			return isAvailable;
		});

		console.log("Available slots:", available);

		setAvailableSlots(available);
		setTime(""); // Reset time when date changes
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		// Check if the selected day is valid
		const selectedDay = new Date(date).getDay();
		if (![2, 3, 4, 5, 6].includes(selectedDay)) {
			alert("Please select a day between Tuesday and Saturday.");
			return;
		}

		console.log("Submitting booking:", { name, email, date, time });

		// Insert booking into Supabase
		const { data, error } = await supabase
			.from("bookings")
			.insert([{ name, email, date, time }]);

		if (error) {
			console.error("Error inserting booking:", error);
			alert("An error occurred while booking. Please try again.");
		} else {
			console.log("Booking successful:", data);
			alert("Booking successful!");
			router.push("/");
		}
	};

	return (
		<div className='min-h-screen flex flex-col'>
			<main className='flex-grow flex flex-col items-center justify-center p-8'>
				<h1 className='text-4xl font-bold mb-6'>Book an Appointment</h1>
				<form
					onSubmit={handleSubmit}
					className='w-full max-w-md'>
					<div className='mb-4'>
						<label
							htmlFor='name'
							className='block mb-2'>
							Name:
						</label>
						<input
							type='text'
							id='name'
							name='name'
							required
							className='w-full p-2 border rounded text-black'
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<div className='mb-4'>
						<label
							htmlFor='email'
							className='block mb-2'>
							Email:
						</label>
						<input
							type='email'
							id='email'
							name='email'
							required
							className='w-full p-2 border rounded text-black'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className='mb-4'>
						<label
							htmlFor='date'
							className='block mb-2'>
							Date:
						</label>
						<input
							type='date'
							id='date'
							name='date'
							required
							className='w-full p-2 border rounded text-black'
							value={date}
							onChange={(e) => setDate(e.target.value)}
						/>
					</div>
					<div className='mb-6'>
						<label
							htmlFor='time'
							className='block mb-2'>
							Time:
						</label>
						<select
							id='time'
							name='time'
							required
							className='w-full p-2 border rounded text-black'
							value={time}
							onChange={(e) => setTime(e.target.value)}
							disabled={!date || availableSlots.length === 0}>
							<option value=''>Select a time</option>
							{availableSlots.map((slot) => (
								<option
									key={slot}
									value={slot}>
									{slot.slice(0, -3)}
								</option>
							))}
						</select>
						{date && availableSlots.length === 0 && (
							<p className='text-red-500 mt-2'>
								No available slots for this date. Please choose another date.
							</p>
						)}
					</div>
					<div className='flex justify-between'>
						<Button
							type='button'
							variant='outline'
							onClick={() => router.push("/")}>
							Back
						</Button>
						<Button
							type='submit'
							variant='outline'
							disabled={!date || !time}>
							Book Appointment
						</Button>
					</div>
				</form>
			</main>
		</div>
	);
}
