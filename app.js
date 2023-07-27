const express = require("express");
const fs = require("fs/promises");
const http = require("http");
const path = require("path");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");

const Routes = require("./routes/index.js");
const cartRouter = require("./routes/api/Cart-router.js")


const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public", express.static(path.join(__dirname + "/public")));

app.use("/", Routes.home);
app.use("/cart", cartRouter)


io.on("connection", (socket) => {
  console.log(`usuario conectado ${socket.id}`);

  socket.on("addProduct", async (productData) => {
    try {
      await cartsManager.create(productData);

      io.emit('productAdded', productData);
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("usuario desconectdo");
  });

  
});

const port = 8080;
server.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});