import 'reflect-metadata';
import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { router } from "@router";
import { ErrorHandling } from "@utils";

dotenv.config();

const app: Express = express();

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api', router);

app.use(ErrorHandling);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
