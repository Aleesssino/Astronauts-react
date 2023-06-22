import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
//import AstronautModel from "./models/astronaut";
import astronautsRoutes from "./routes/astronauts";
import morgan from "morgan";
import createHttpError, {isHttpError} from "http-errors";
import cors from "cors";

const app = express();

// adding cors to solve fetching data block 
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);


  app.use(morgan("dev"));

  app.use(express.json());
  
  app.use("/api/astronauts", astronautsRoutes);

  app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found..."));
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((error: unknown, req: Request, res: Response, next: NextFunction ) => {
    console.error(error);
    let errorMessage = "An unknown Error";
    let statusCode = 500;
    if (isHttpError(error)) {
      statusCode = error.status;
      errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
  })

export default app;