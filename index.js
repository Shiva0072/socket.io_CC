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

let usersInfo={};
let socketMap={};

io.on('connection',(socket)=>{
    // console.log("connected to client : ",socket.id);
    socket.on('login',(data)=>{
        //making secure
        if(usersInfo[data.username]){
            if(usersInfo[data.username]==data.password){
                socket.join(data.username);
                socket.emit("loggedIn");        
                socketMap[socket.id]=data.username;
            }
            else{
                socket.emit('login_failed');
            }
        }
        else{
            usersInfo[data.username]=data.password;
            socketMap[socket.id]=data.username;
            socket.join(data.username);
            socket.emit("loggedIn"); 
        }         
        // console.log(usersInfo); console.log(socketMap);
    });

    socket.on('msg_send',(data)=>{
        data.from=socketMap[socket.id];
        if(data.to){
            // console.log('directed to room of  : ',data.to);
            io.to(data.to).emit('msg_rcvd',data);
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
userInfo keeps the track of username and passwords.
=======
If the user logs in with the same name as some previosly logged-in user then if the passwords dont match then not possible to log-in
socketMap is created so that, we can track who is sending messages to whom. data.from is like creating a new property from:socket.roomName in the data-object.

*/