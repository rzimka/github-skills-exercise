import { Schema, model, type InferSchemaType } from 'mongoose';

const teamSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    motto: { type: String, required: true, trim: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    weeklyPoints: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export type TeamDocument = InferSchemaType<typeof teamSchema>;

const Team = model<TeamDocument>('Team', teamSchema);

export default Team;