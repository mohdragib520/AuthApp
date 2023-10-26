const express=require('express');
const app =express();
require('dotenv').config();

const PORT=process.env.PORT || 4000;

// cookie parser

const cookieParser=require('cookie-parser');
app.use(cookieParser());

app.use(express.json());


require("./config/databse").connect();


// route import and mount

const user=require("./routes/user");
app.use("/api/v1",user);



// activate server

app.listen(PORT,()=>{
    console.log(`App is listening at port no ${PORT}`);
})