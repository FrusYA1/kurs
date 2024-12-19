import { app, port } from "./src/app.js";

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}/`);
});
