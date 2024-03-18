import mongoose, { Schema, model } from "mongoose";

const candidateSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    party: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      required: true,
    },
    votes: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: "User",
          required: true,
        },
        votedAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },
  { timestamps: true }
);

export const Candidate = mongoose.model("Candidate", candidateSchema);
