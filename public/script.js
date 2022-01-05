//client : each client contains an instance of the server i.e., a socket. 
// socket=io() ... just initializing the io() function, tries to establish a connection to the io interface of the server
const socket=io();

const btn=document.getElementById('boom');

btn.onclick = function(e){
    socket.emit('boom', console.log("button clicked : ",e));
}


socket.on("whizzz",()=>{
    const div=document.createElement('div');
    div.innerHTML="whizzz";
    document.body.appendChild(div);
});