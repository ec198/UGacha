import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout successful" });

  // Remove with expired cookie
  response.headers.append("Set-Cookie", "token=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict");

  return response;
}
