
const server = require('./server.js');
const port = process.env.PORT || 3000;

//node server listens on specified port
server.listen(port, () => {
  console.log(`listening on port ${port}`);
})

