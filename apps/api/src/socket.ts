import {Server} from "socket.io"
import http from "http"

let io:Server

export function initSocket(server:http.Server){
  io=new Server(server,{
    cors:{
      origin:"http://localhost:3000"
    }
  })

  io.on("connection",(socket)=>{
    console.log("Client is connected now",socket.id)

    socket.on("disconnected",()=>{
      console.log("Client disconnected",socket.id)
    })

  })
}

export function getIo(){
  if(!io){
    throw new Error("Socket.io is not initialized")
  }
  return io
}