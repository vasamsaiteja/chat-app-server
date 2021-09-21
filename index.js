const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const {Server} = require("socket.io");
const mongoose = require("mongoose");
require("dotenv").config()

// mongoDb 
// mongoose.set('useCreateIndex', true)
// mongoose.set('useFindAndModify', false)
mongoose.connect(
	'mongodb+srv://saiteja_mongodb:tB336ufKGcRSQ03r@saiteja-projects.4ahv4.mongodb.net/vmessenger_db',
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	() => {
        let newUser = {username: "Company Inc", roomName: "Highway 37" }
        users.create(newUser,(err,user)=>{
            if (err){
                console.log("error:",err)
            }else{
                console.log(user)
            }
        })
		console.log('DB Connected')
	}
)
const usersSchema = new mongoose.Schema({
    username:{type:String,required:true},
    roomName:{type:String,required:true}
})
const users = new mongoose.model("users",usersSchema)

app.use(cors());

const port = process.env.PORT || 3005

const server = http.createServer(app);

const io = new Server (server,{
    cors:{
        origin:"*",
        methods:["GET","POST"],
    },
});

io.on("connection",(socket)=>{
    console.log(`User Connected :${socket.id}`)

    socket.on("join_room",(data)=>{
        socket.join(data)
        console.log(`User with ID:${socket.id} joined room:${data}`)
    })

    socket.on("send_message",(data)=>{
        socket.to(data.room).emit("receive_message",data)
        console.log(`data ${data.message}`)
    })

    socket.on("disconnect",()=>{
        console.log("User Disconnected", socket.id);
})

})

app.get("/",(req,res)=>{
    res.send(process.env.SECRET_KEY)
})

server.listen(port,()=>{ 
    console.log("Server Running");
});