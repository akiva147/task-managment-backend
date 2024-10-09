import express, {
  Express,
  NextFunction,
  Request,
  Response,
  json,
  urlencoded,
} from "express";
import "dotenv/config";
import { validateEnvs } from "./utils/env.utils";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { connectToDatabase } from "./utils/db.utils";
import { router as taskRouter } from "./routes/task.route";

const app = express();
const { PORT, CLIENT_URL } = validateEnvs();

app.use(
  cors({
    origin: CLIENT_URL,
  })
);
app.use(helmet());
app.use(compression({ level: 6 }));
app.use(json());
app.use(urlencoded({ extended: true }));

connectToDatabase()
  .then(() => {
    app.use("/task", taskRouter);

    app.get("*", (req: Request, res: Response) => {
      res.status(404);
    });
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });
