'use client'
import { useEffect, useState } from "react";

export default function ProfilePage() {
	const [userData, setUserData] = useState<{
		username: string;
		email: string;
	} | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		async function fetchUserProfile() {
			try {
				const response = await fetch("api/users/profile", {
					method: "GET",
					credentials: "include",
				});

				if (!response.ok) {
					throw new Error((await response.json()).error || "Failed to fetch profile");
				}

				const data = await response.json();
				setUserData(data.user);
			} catch (err: any) {
				setError(err.message || "Something went wrong");
			} finally {
				setLoading(false);
			}
		}

		fetchUserProfile();
	}, []);

	if (loading) {
		return <div className="h-screen">Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className="h-screen flex flex-col justify-center items-center">
			<h1 className="text-2xl font-bold mb-4">User Profile</h1>
			{userData ? (
				<div>
					<p>
						<strong>Username:</strong> {userData.username}
					</p>
					<p>
						<strong>Email:</strong> {userData.email}
					</p>
				</div>
			) : (
				<p>No user data available</p>
			)}
		</div>
	);
}
