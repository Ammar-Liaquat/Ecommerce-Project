const express = require("express")
const { getallproduct, editproduct, deleteproduct, createproduct, } = require("../controllers/productControllers")
const routes = express.Router()
routes.use(express.json())
const upload = require("../middelwares/multer")
const { middelware } = require("../middelwares/auth")

routes.post("/add-product",upload.single("image"), middelware,createproduct)
routes.get("/products", getallproduct)
routes.patch("/edit/:id", middelware,editproduct)
routes.delete("/delproducts/:id", middelware, deleteproduct)

module.exports = routes