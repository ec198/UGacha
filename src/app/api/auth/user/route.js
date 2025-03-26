import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { MongoClient, ServerApiVersion } from "mongodb";

// MongoDB Client Setup
const uri = "mongodb+srv://akb38117:63h7CtnHzKNBhQE7@ugachacluster.wqcbq.mongodb.net/?retryWrites=true&w=majority&appName=UGachaCluster";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const SECRET_KEY = "your_secret_key"; // Use the same secret as in signin route

// MongoDB Connection
const connectToDatabase = async () => {
  try {
    // No need to check isConnected anymore
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Could not connect to MongoDB");
  }
};

// JWT Authentication Middleware
export async function GET(req) {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Retrieve the JWT token from cookies
    const cookieHeader = req.headers.get("cookie");
    const token = cookieHeader?.split("; ").find(c => c.startsWith("token="))?.split("=")[1];

    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: 'User not authenticated' }),
        { status: 401 }
      );
    }

    // Verify the JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid or expired token' }),
        { status: 401 }
      );
    }

    // Fetch user from MongoDB using the decoded username
    const db = client.db("UGachaCluster");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username: decoded.username });
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: 'User not found' }),
        { status: 404 }
      );
    }

    // Return user data (you can customize the response here)
    return new NextResponse(
      JSON.stringify({ username: user.username }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching user:", error);
    return new NextResponse(
      JSON.stringify({ message: 'Error fetching user', error: error.message }),
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
