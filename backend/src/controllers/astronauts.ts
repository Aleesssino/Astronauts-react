import { RequestHandler } from "express";
import AstronautModel from "../models/astronaut";
import createHttpError from "http-errors";
import mongoose from "mongoose";

// get all astronauts
export const getAstronauts: RequestHandler = async (req, res, next) => {
  try {
    //throw Error("some error");
    const astronauts = await AstronautModel.find().exec();
    res.status(200).json(astronauts);
  } catch (error) {
    next(error);
  }
};

// get one astronaut by Id
export const getAstronaut: RequestHandler = async (req, res, next) => {
  const astronuatId = req.params.astronautId;
  try {
    if (!mongoose.isValidObjectId(astronuatId)) {
      throw createHttpError(400, "Invalid astronaut Id");
    }

    const astronaut = await AstronautModel.findById(astronuatId).exec();

    if (!astronaut) {
      throw createHttpError(404, "Astronaut not found.");
    }

    res.status(200).json(astronaut);
  } catch (error) {
    next(error);
  }
};

// create one astronaut
interface createAstronautBody {
  name?: string;
  age?: number;
  nationality?: string;
  dateOfBirth?: Date;
  spaceAgency?: string;
  missionsCompleted?: number;
  skills?: [string];
}

export const createAstronaut: RequestHandler<
  unknown,
  unknown,
  createAstronautBody,
  unknown
> = async (req, res, next) => {
  const name = req.body.name;
  const age = req.body.age;
  const nationality = req.body.nationality;
  const dateOfBirth = req.body.dateOfBirth || "";
  const spaceAgency = req.body.spaceAgency;
  const missionsCompleted = req.body.missionsCompleted;
  const skills = req.body.skills || [];

  try {
    if (
      !name ||
      !age ||
      !nationality ||
      !spaceAgency ||
      !missionsCompleted
    ) {
      throw createHttpError(
        400,
        "Add required properties (name, age, nationality, space agency, completed missions)"
      );
    }

    const newAstronaut = await AstronautModel.create({
      name: name,
      age: age,
      nationality: nationality,
      dateOfBirth: dateOfBirth,
      spaceAgency: spaceAgency,
      missionsCompleted: missionsCompleted,
      skills: skills,
    });

    res.status(201).json(newAstronaut);
  } catch (error) {
    next(error);
  }
};

// update astronaut
interface UpdateAstronautParam {
  astronautId: string;
}

interface UpdateAstronautBody {
  name?: string;
  age?: number;
  nationality?: string;
  dateOfBirth?: Date;
  spaceAgency?: string;
  missionsCompleted?: number;
  skills?: [string];
}
export const upadateAstronaut: RequestHandler<
  UpdateAstronautParam,
  unknown,
  UpdateAstronautBody,
  unknown
> = async (req, res, next) => {
  const astronautId = req.params.astronautId;
  const updatedName = req.body.name;
  const updatedAge = req.body.age;
  const updatedNationality = req.body.nationality;
//  const updatedDateOfBirth = req.body.dateOfBirth;
  const updatedSpaceAgency = req.body.spaceAgency;
  const updatedMissionsCompleted = req.body.missionsCompleted;
  const updatedSkills = req.body.skills || [];

  try {
    if (!mongoose.isValidObjectId(astronautId)) {
      throw createHttpError(400, "Invalid astronaut Id");
    }
    if (
      !updatedName ||
      !updatedAge ||
      !updatedNationality ||
      !updatedSpaceAgency ||
      !updatedMissionsCompleted
    ) {
      throw createHttpError(
        400,
        "Add required properties (name, age, nationality, space agency, completed missions)"
      );
    }

    const astronaut = await AstronautModel.findById(astronautId).exec();
    if (!astronaut) {
      throw createHttpError(404, "Astronaut not found.");
    }

    astronaut.name = updatedName;
    astronaut.age = updatedAge;
    astronaut.nationality = updatedNationality;
   // astronaut.dateOfBirth = updatedDateOfBirth;
    astronaut.spaceAgency = updatedSpaceAgency;
    astronaut.missionsCompleted = updatedMissionsCompleted;
    astronaut.skills = updatedSkills;

    const updatedAstronaut = await astronaut.save();

    res.status(200).json(updatedAstronaut);
  } catch (error) {
    next(error);
  }
};

// delete astronaut
export const deleteAstronaut: RequestHandler = async (req, res, next) => {
  const astronautId = req.params.astronautId;

  try {
    if (!mongoose.isValidObjectId(astronautId)) {
      throw createHttpError(400, "Invalid astronaut Id");
    }    
 
    const astronaut = await AstronautModel.findById(astronautId).exec();

    if (!astronaut) {
      throw createHttpError(404, "Astronaut not found");
    }

    await astronaut.deleteOne();
    
    res.sendStatus(204);

  } catch (error) {
    next(error);
  }
};
