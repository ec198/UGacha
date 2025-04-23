import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { MongoClient, ServerApiVersion } from "mongodb";

const uri = "mongodb+srv://akb38117:63h7CtnHzKNBhQE7@ugachacluster.wqcbq.mongodb.net/?retryWrites=true&w=majority&appName=UGachaCluster";

//Mongo Connection
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function POST(req) {
  try {
    //Hashes Pass and Limits User/Pass info
    const { username, password } = await req.json();
    console.log("Received data:", { username, password });

    if (!username || !password) {
      console.log("Missing required fields");
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db("UGachaCluster");
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      console.log("User already exists:", username);
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const result = await usersCollection.insertOne({
      username,
      password: hashedPassword,
      createdAt: new Date(),
      packCount: 2, 
      cardInventory: [], 
    });

    //Will Print Errors if found
    if (!result.acknowledged) {
      console.error("Failed to insert new user into MongoDB");
      return NextResponse.json({ error: "Failed to insert user" }, { status: 500 });
    }

    console.log("User registered successfully");
    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });

  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });

  } finally {
    await client.close(); 
  }
}
