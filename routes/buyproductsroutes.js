const express = require("express")
const { buyproduct } = require("../controllers/buy-product-Controllers")
const { middelware } = require("../middelwares/auth")
const routes = express.Router()
routes.post("/buy",middelware,buyproduct)

module.exports = routes