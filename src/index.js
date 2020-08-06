const app = require("./app");
const port = process.env.PORT;

app.listen(port, () => {
  //console.log(process.env.EMAIL, process.env.PASSWORD);
  console.log("Server runnong on port " + port);
});
