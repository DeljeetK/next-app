import { connectToMongoDB } from "@/dbConfig/dbconfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

connectToMongoDB();

export async function GET(request: NextRequest) {
  try {
    // 1. Get the token from cookies
    const token = request.cookies.get("token")?.value;

    // 2. Check if the token exists
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    // 3. Verify the token and ensure it contains the correct payload
    let decodedToken: JwtPayload | null = null;
    try {
      decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as JwtPayload;
    } catch (error) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    // 4. Check if the decoded token contains an ID
    if (!decodedToken || !decodedToken.id) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token payload" },
        { status: 401 }
      );
    }

    // 5. Fetch user details from the database
    const user = await User.findById(decodedToken.id).select("username email");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 6. Respond with user profile data
    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
