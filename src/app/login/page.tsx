'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaAngleLeft } from 'react-icons/fa6';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

// Zod schema for validation
const loginSchema = z.object({
	email: z
		.string()
		.nonempty("Email is required")
		.email("Invalid email format"),
	password: z
		.string()
		.nonempty("Password is required")
		.min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	// Initialize react-hook-form with Zod schema validation
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	// Submit handler for the form
	const onLogin = async (data: LoginFormData) => {
		try {
			setLoading(true);
			const response = await axios.post('api/users/login', data);
			if (response?.data?.status === 200) {
				toast.success('Login successful! Redirecting...');
				router.push('/profile');
			}
			else {
				toast.error("Invalid Credentials")
			}
		} catch (error: any) {
			toast.error(error.response?.data?.message || error.message)
			console.error('Login failed', error.response?.data?.message || error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<h1 className="py-10 mb-10 text-5xl">
				{loading ? "We're logging you in..." : 'Login'}
			</h1>

			<form
				onSubmit={handleSubmit(onLogin)}
				className="flex flex-col items-center justify-center"
			>
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
					{loading ? 'Logging in...' : 'Login'}
				</button>
			</form>

			{/* Register Link */}
			<Link href="/sign-up">
				<p className="mt-10">
					Do not have an account yet?
					<span className="font-bold text-green-600 ml-2 cursor-pointer underline">
						Create now
					</span>
				</p>
			</Link>

			{/* Back to Homepage Link */}
			<Link href="/">
				<p className="mt-8 opacity-50">
					<FaAngleLeft className="inline mr-1" />Go to Homepage
				</p>
			</Link>
		</div>
	);
}
