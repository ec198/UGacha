import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for TypeScript type safety
export interface LocationCard extends Document {
  name: string;
  latitude: number;
  longitude: number;
}

// Define the Mongoose schema
const LocationCardSchema = new Schema<LocationCard>(
  {
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  {
    collection: 'packlocation', // 👈 ensure this points to the correct MongoDB collection
  }
);

// Export the model (reuse existing if already compiled)
export const LocationCardModel =
  mongoose.models.LocationCard || mongoose.model<LocationCard>('LocationCard', LocationCardSchema);
