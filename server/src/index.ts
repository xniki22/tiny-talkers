import "dotenv/config";

import { app } from "./app";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(
    `Tiny Talkers server running at http://localhost:${PORT}`
  );
});