const express = require("express");
const http = require("http");
const path = require("path");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");


const Routes = require("./routes/index.js");
const socketManager = require ("./websocket/socketManager.js")

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public", express.static(path.join(__dirname + "/public")));


app.use((req,res,next) =>{
  req.io = io
  next()
})

app.use("/", Routes.home);

app.use("/api", (req, res, next)=>{
  req.io = io
  next()
}, Routes.api)


io.on("connection", socketManager)

const port = 8080;
server.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});