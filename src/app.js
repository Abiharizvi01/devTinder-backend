//express js is a open source framework of node js
import express from "express";

const app = express();

app.use("/test",(req,res)=>{
    res.send("Hello from the server");
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000....");
});