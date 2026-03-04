const dotenv = require("dotenv")
const helmet = require("helmet")
const morgan = require("morgan")
const cors = require("cors")
dotenv.config({quiet:true})
const connectdb = require("./config/db")
connectdb()
const routes = require("./routes/index")
const express = require("express")
const app = express()
app.use(express.json())
app.use(helmet())
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))
app.use(morgan("dev"))
app.use("/api",routes)

app.get("/",(req,res)=>{

    res.send("welcome")
})
const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`server is connected on ${port}`);
    
})
