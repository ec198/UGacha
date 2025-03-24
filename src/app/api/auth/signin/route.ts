import { NextResponse } from "next/server";

const users = [
  { username: "testuser", password: "password123" }, // Example user, replace with your database logic
];

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Missing username or password" }, { status: 400 });
    }

    // Check if user exists and password is correct
    const user = users.find((user) => user.username === username);

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Simulate returning a token (use JWT or sessions in production)
    return NextResponse.json({ message: "Signed in successfully!", token: "fake-jwt-token" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
