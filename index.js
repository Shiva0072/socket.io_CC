const express=require("express");
const app=express();
const httpServer=require('http').createServer(app);                                          //http server instance for app
const io=require('socket.io')(httpServer,{cors: {origin: "*"}});                             // pass httpServer to the socket.io library

app.use(express.static('public'));
app.set("view engine",'ejs');

app.get("/",(req,res)=>{
    res.render('home');
});

httpServer.listen(8000,()=>{
    console.log("Server is running ");
});

io.on('connection',(socket)=>{
    // console.log("connected to client : ",socket.id);

    socket.on('boom',()=>{
        console.log("button clicked by socket : ",socket.id);
    });

    setInterval(()=>{
        socket.emit("whizzz");
    },2000);

});

/*
setInterval is server-sided event.
boom is client-sided event.
*/