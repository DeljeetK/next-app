import mongoose from "mongoose";

let isConnected = false; // Track the connection state

export async function connectToMongoDB() {
  if (isConnected) {
    console.log("MongoDB is already connected.");
    return;
  }

  try {
    // Wait for the connection to be established
    const connection = await mongoose.connect(process.env.MONGO_URI!);

    isConnected = !!connection.connections[0].readyState;

    console.log(
      `[${new Date().toISOString()}] MongoDB connected successfully.`
    );
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] MongoDB connection error:`,
      error
    );

    // Exit the process only if this is critical (optional)
    process.exit(1);
  }

  // Handle connection events
  mongoose.connection.on("disconnected", () => {
    isConnected = false;
    console.log(`[${new Date().toISOString()}] MongoDB disconnected.`);
  });

  mongoose.connection.on("error", (err) => {
    console.error(
      `[${new Date().toISOString()}] MongoDB connection error:`,
      err
    );
  });
}
