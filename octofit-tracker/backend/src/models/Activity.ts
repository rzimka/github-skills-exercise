import { Schema, model, type InferSchemaType } from 'mongoose';

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    type: {
      type: String,
      required: true,
      enum: ['run', 'ride', 'strength', 'yoga', 'walk', 'swim'],
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    caloriesBurned: { type: Number, required: true, min: 1 },
    distanceKm: { type: Number, required: true, min: 0 },
    performedAt: { type: Date, required: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export type ActivityDocument = InferSchemaType<typeof activitySchema>;

const Activity = model<ActivityDocument>('Activity', activitySchema);

export default Activity;