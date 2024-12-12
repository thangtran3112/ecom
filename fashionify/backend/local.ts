import dotenv from "dotenv";
import app from "./app/app";

/* CONFIGURATION */
dotenv.config();
const port = process.env.PORT || 4000;

// https://github.com/wclr/ts-node-dev/issues/120
process.on("SIGTERM", (err: any) => {
  process.exit(1);
});

const main = async () => {
  app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
  });
};

main();
