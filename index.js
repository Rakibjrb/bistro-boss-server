const { app, checkdb } = require("./app");

const port = process.env.PORT || 5000;

app.listen(port, () => {
  checkdb();
  console.log(`[+] server running on port [+] http://localhost:${port}`);
});
