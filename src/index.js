import express from "express";
import { userRouter } from "./routers/user.js";
import { taskRouter } from "./routers/task.js";

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
