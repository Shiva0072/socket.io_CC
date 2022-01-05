//client : each client contains an instance of the server i.e., a socket. 
// socket=io() ... just initializing the io() function, tries to establish a connection to the io interface of the server
//emit has eventName and eventObject. On has eventName and callback func
const socket=io();

let loginDiv=$('#loginBox');
let userName=$('#username');
let password=$('#password');
let startBtn=$('#startBtn');
let chatDiv=$('#chatBox');
let toUser=$('#toUser');
let newMsg=$('#msg');
let sendBtn=$('#send');
let MessagesList=$('#MessagesList');

chatDiv.hide();

startBtn.on('click',()=>{
    socket.emit("login",{
        username: userName.val(),
        password: password.val()
    });
});

socket.on('loggedIn',()=>{
    // console.log("user logged in");
    loginDiv.hide();
    chatDiv.show(); 
});

sendBtn.on('click',()=>{
    socket.emit('msg_send',{
        to: toUser.val(),
        msg: newMsg.val()
    });
});

socket.on('msg_rcvd',(data)=>{
    // console.log("here we are client: ",data);  //open 3 tabs to see the action. 
    MessagesList.append($('<li>').text(data.msg));
});