'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaAngleLeft } from 'react-icons/fa6';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// Zod schema for validation
const signUpSchema = z.object({
	username: z
		.string()
		.nonempty("Username is required")
		.min(3, "Username must be at least 3 characters"),
	email: z
		.string()
		.nonempty("Email is required")
		.email("Invalid email format"),
	password: z
		.string()
		.nonempty("Password is required")
		.min(6, "Password must be at least 6 characters"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	// Initialize react-hook-form with Zod schema validation
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUpFormData>({
		resolver: zodResolver(signUpSchema),
	});

	// Submit handler for the form
	const onSignUp = async (data: SignUpFormData) => {
		try {
			setLoading(true);

			const response = await axios.post('/api/users/signup', data);
			// console.log('Signup successful', response.data);
			router.push('/login');
		} catch (error: any) {
			console.error('Failed to sign up the user', error.response?.data?.message || error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<h1 className="py-10 mb-10 text-5xl">{loading ? 'Processing...' : 'Sign Up'}</h1>

			<form
				onSubmit={handleSubmit(onSignUp)}
				className="flex flex-col items-center justify-center"
			>
				{/* Username Input */}
				<input
					className="w-[350px] text-slate-800 p-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:border-gray-600"
					id="username"
					type="text"
					placeholder="Your Username..."
					{...register('username')}
				/>
				{errors.username && (
					<p className="text-red-500 text-sm mb-4">{errors.username.message}</p>
				)}

				{/* Email Input */}
				<input
					className="w-[350px] text-slate-800 p-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:border-gray-600"
					id="email"
					type="text"
					placeholder="Your Email..."
					{...register('email')}
				/>
				{errors.email && (
					<p className="text-red-500 text-sm mb-4">{errors.email.message}</p>
				)}

				{/* Password Input */}
				<input
					className="w-[350px] text-slate-800 p-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:border-gray-600"
					id="password"
					type="password"
					placeholder="Your Password..."
					{...register('password')}
				/>
				{errors.password && (
					<p className="text-red-500 text-sm mb-4">{errors.password.message}</p>
				)}

				{/* Submit Button */}
				<button
					type="submit"
					className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 uppercase px-40 py-3 mt-10 font-bold"
					disabled={loading}
				>
					{loading ? 'Processing...' : 'SignUp'}
				</button>
			</form>

			{/* Login Link */}
			<Link href="/login">
				<p className="mt-10">
					Do you already have a account?{' '}
					<span className="font-bold text-green-600 ml-2 cursor-pointer underline">
						Login to your account
					</span>
				</p>
			</Link>

			{/* Back to Homepage Link */}
			<Link href="/">
				<p className="mt-8 opacity-50">
					<FaAngleLeft className="inline mr-1" /> Back to the Homepage
				</p>
			</Link>
		</div>
	);
}
