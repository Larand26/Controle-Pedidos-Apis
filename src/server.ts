import appConfig from "./config/app.config.js";
import app from "./app.js";

const port = appConfig.api.port;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
