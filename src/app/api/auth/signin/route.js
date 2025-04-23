import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MongoClient, ServerApiVersion } from "mongodb";

// MongoDB URI and Secret Key
const uri = "mongodb+srv://akb38117:63h7CtnHzKNBhQE7@ugachacluster.wqcbq.mongodb.net/?retryWrites=true&w=majority&appName=UGachaCluster";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const SECRET_KEY = "your_secret_key"; 

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  try {
    await client.connect();
    cachedDb = client.db("UGachaCluster");
    return cachedDb;
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw new Error("Database connection failed");
  }
}

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({ username });

    if (!existingUser) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    // Generate JWT Token - to login
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

    const response = NextResponse.json({ message: "Login successful" }, { status: 200 });

    const isDev = process.env.NODE_ENV !== "production";
    response.headers.append("Set-Cookie", `token=${token}; Path=/; HttpOnly; ${isDev ? "" : "Secure;"} SameSite=Strict`);

    return response;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Login error:", errorMessage);
    return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
  }
}
