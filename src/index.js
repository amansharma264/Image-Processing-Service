import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 2027, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("MONGODB connection failed !!!", err);
    // Explicitly exit the process on failure
    process.exit(1);
  });
