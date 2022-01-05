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

    socket.on('login',(data)=>{
        socket.join(data.username);
        socket.emit("loggedIn");
    });

    socket.on('msg_send',(data)=>{
        if(data.to){
            // console.log('directed to room of  : ',data.to);
            io.to(data.to).emit('msg_rcvd',{
                to: data.to,
                msg: data.msg
            });
        }
        else{
            //io.emit('msg_rcvd',data.msg) would send to this user also
            socket.broadcast.emit('msg_rcvd',data);
        }
    });

});

/*
io and socket could be our potential optn on server side but only socket on client side
=======
io.to(data.to).emit... is for the particular user: a private message. A user has its own room named by his own name. we are simply directing the message to a room and in the process a private message is delivered                              
when no user-name is supplied, we simply pass it to all the users.  
=======

*/