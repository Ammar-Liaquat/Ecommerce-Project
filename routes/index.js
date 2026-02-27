const express = require("express")
const routes = express.Router()

const userapi = require("./userroutes")
const prdocutapi = require("./productroutes")
const buyproductapi = require("./buyproductsroutes")

routes.use("/",userapi)
routes.use("/",prdocutapi)
routes.use("/",buyproductapi)

module.exports = routes