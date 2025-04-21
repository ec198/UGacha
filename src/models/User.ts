import mongoose from "mongoose";

const CardEntrySchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainingCard', required: true },
    count: { type: Number, default: 1 },
  },
  { _id: false } // Prevents MongoDB from adding an extra _id to each entry
);

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cardInventory: { type: [CardEntrySchema], default: [] },
  packCount: { type: Number, default: 1 },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
