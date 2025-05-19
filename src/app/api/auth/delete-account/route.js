import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { MongoClient, ServerApiVersion } from "mongodb";

//Env Connection
const uri = process.env.MONGODB_URI;
const SECRET_KEY = process.env.JWT_SECRET;
console.log("ENV TEST: ", {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET
});
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function DELETE(req) {
  try {
    const cookie = req.headers.get("cookie");
    const token = cookie?.split("; ").find((c) => c.startsWith("token="))?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    await client.connect();
    const db = client.db("UGachaCluster");
    const users = db.collection("users");

    const result = await users.deleteOne({ username: decoded.username });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Clearing token's cookie
    const res = NextResponse.json({ message: "Account deleted successfully" });
    res.headers.append("Set-Cookie", "token=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict");

    return res;
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  } finally {
    await client.close();
  }
}
