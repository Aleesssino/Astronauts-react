import { Astronaut } from "../models/astronaut"


async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        throw Error(errorMessage);
    }
}

export async function fetchAstronauts(): Promise<Astronaut[]>{
    const response = await fetchData("http://localhost:5000/api/astronauts", {method: "GET"});
    return response.json();
}

export interface AstronautInput {
  _id: string;
  name: string;
  age: string;
  nationality: string;
  dateOfBirth: string;
  spaceAgency: string;
  missionsCompleted: string;
  skills?: string;
}


export async function createAstronaut(astronaut: AstronautInput): Promise<Astronaut> {
    const response = await fetchData("http://localhost:5000/api/astronauts", 
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(astronaut),
    });
    return response.json();
}

export async function updateAstronaut(astronautId: String, astronaut: AstronautInput): Promise<Astronaut> {
    const response =await fetchData("http://localhost:5000/api/astronauts/" + astronautId,
    {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(astronaut),
    });
    return response.json();
}

export async function deleteAstronaut(astronautId: string) {
    await fetchData("http://localhost:5000/api/astronauts/" + astronautId, { method: "DELETE"});
}