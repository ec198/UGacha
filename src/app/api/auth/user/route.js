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

const SECRET_KEY = "your_secret_key"; 

// MongoDB Connection
const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Could not connect to MongoDB");
  }
};

export async function GET(req) {
  try {
    await connectToDatabase();

    const cookieHeader = req.headers.get("cookie");
    const token = cookieHeader?.split("; ").find(c => c.startsWith("token="))?.split("=")[1];

    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: 'User not authenticated' }),
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid or expired token' }),
        { status: 401 }
      );
    }

    const db = client.db("UGachaCluster");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username: decoded.username });
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: 'User not found' }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ 
        username: user.username, 
        cardInventory: user.cardInventory,
        packCount: user.packCount ?? 0 
      }),
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
