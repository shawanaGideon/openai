import app from "./app.js";
import { connectTodatabase } from "./db/connection.js";

// connection and listeners
const PORT = process.env.PORT || 4002
connectTodatabase()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`${PORT} server open and conncted to Database 🤟`)
    );
  })
  .catch((err) => console.log(err));
