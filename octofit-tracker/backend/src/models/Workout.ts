import { Schema, model, type InferSchemaType } from 'mongoose';

const workoutSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    focus: { type: String, required: true, trim: true },
    intensity: {
      type: String,
      required: true,
      enum: ['low', 'moderate', 'high'],
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    equipment: [{ type: String, required: true }],
    instructions: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export type WorkoutDocument = InferSchemaType<typeof workoutSchema>;

const Workout = model<WorkoutDocument>('Workout', workoutSchema);

export default Workout;