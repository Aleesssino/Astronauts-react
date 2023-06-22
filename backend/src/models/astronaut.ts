import { InferSchemaType, Schema, model } from "mongoose";

const astronautSchema = new Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    //missions: { type: Number, required: true },
    nationality: { type: String, required: true },
// change format of date (now YYYY-MM-DD) *
    dateOfBirth: { type: Date, required: false },
    //gender: { type: String, required: true },
    spaceAgency: { type: String, required: true },
    missionsCompleted: { type: Number, required: false },
    skills: { type: [String], required: false},
});

type Astronaut = InferSchemaType<typeof astronautSchema>;

export default model<Astronaut>("Astronaut", astronautSchema);