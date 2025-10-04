import connectDB from "./db/index.js";
import { app } from "./app.js";

// NOTE: Environment variables are loaded automatically via the 'nodemon -r dotenv/config' script
// in package.json. Removed the redundant 'dotenv.config()' and its import.

connectDB()
  .then(() => {
    // Start the server after successful DB connection
    app.listen(process.env.PORT || 2004, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("MONGODB connection failed !!!", err);
    // Explicitly exit the process on failure
    process.exit(1);
  });
