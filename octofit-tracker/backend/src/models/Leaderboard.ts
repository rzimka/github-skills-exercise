import { Schema, model, type InferSchemaType } from 'mongoose';

const leaderboardEntrySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    points: { type: Number, required: true, min: 0 },
    rank: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const leaderboardSchema = new Schema(
  {
    periodLabel: { type: String, required: true, trim: true },
    startsOn: { type: Date, required: true },
    endsOn: { type: Date, required: true },
    entries: [leaderboardEntrySchema],
  },
  { timestamps: true }
);

export type LeaderboardDocument = InferSchemaType<typeof leaderboardSchema>;

const Leaderboard = model<LeaderboardDocument>('Leaderboard', leaderboardSchema);

export default Leaderboard;