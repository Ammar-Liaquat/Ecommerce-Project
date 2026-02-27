const buyProduct = require("../models/buyproducts")
const Products = require("../models/productmodels")


const buyproduct = async (req,res) => {

    try {
        const orders = []
        const userId = req.user.id
        const {id, name, quantity,address,phone} = req.body
        let product = await Products.findOne({_id:id})
        
        if(!product) return res.status(401).json({
            message:"invalid id"
        })
        
        if(product.name !== name) return res.status(401).json({
            message:"product name invalid "
        })
        
        if(product.stock < quantity) return res.status(401).json({
            message:"empty stock"
        })
        let order = await buyProduct.create({
            userId,
            productId: product._id,
            id,
            name,
            address,
            phone,
            quantity,
            totalprice: product.price * quantity
        })
       
        product.stock -= quantity
        await product.save()
       res.status(200).json({
        message:"prodcut buy successfully",
        code:200,
        order
       }) 
    

    } catch (error) {
        res.status(500).json({
            message:"internal server error",
            code:500,
            error:error.message
        })
    }


}

module.exports = {
    buyproduct
}
