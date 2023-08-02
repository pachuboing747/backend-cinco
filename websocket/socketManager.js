function socketManager(socket){
    console.log(`usuario conectado ${socket.id}`);
      
    socket.on("disconnect", () => {
        console.log("usuario desconectdo");
    });
      
}

module.exports = socketManager;