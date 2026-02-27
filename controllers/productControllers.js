const Product = require("../models/productmodels");
const fs = require("fs");

const createproduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, price, stock, category } = req.body;
    if (!name) {
      if (req.file) return fs.unlinkSync(req.file.path);
      return res.status(400).json({
        message: "name required",
        code: 400,
      });
    }
    if (!price) {
      if (req.file) return fs.unlinkSync(req.file.path);
      return res.status(400).json({
        message: "price required",
      });
    }
    if (!stock) {
      if (req.file) return fs.unlinkSync(req.file.path);
      return res.status(400).json({
        message: "stock required",
      });
    }
    if (!category) {
      if (req.file) return fs.unlinkSync(req.file.path);
      return res.status(400).json({
        message: "category required",
      });
    }
    if (!req.file)
      return res.status(400).json({
        message: "avatar required",
      });

    const product = await Product.create({
      userId,
      name,
      price,
      stock,
      avatar: req.file.path,
      category,
    });
    res.status(201).json({
      message: "add cloth successfully",
      code: 201,
      data: product,
    });
  } catch (error) {
    res.status(201).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

const getallproduct = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 3;

    let skip = (page - 1) * limit;
    let product = await Product.find().skip(skip).limit(limit);
    let totalproduct = await Product.countDocuments();
    let totalpages = Math.ceil(page / limit);

    res.status(200).json({
      message: "products fetched",
      code: 200,
      data: product,
      product: {
        page,
        limit,
        totalproduct,
        totalpages,
      },
    });
  } catch (error) {
    res.status(201).json({
      message: "internal server error",
      error: error.message,
    });
  }
};
const editproduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {$set:req.body}
    );
    
    res.status(200).json({
      message: "product edit successfully ",
      code: 200,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};
const deleteproduct = async (req,res) =>{

 try {
    const product = await Product.findByIdAndDelete(
      req.params.id,
    );
    res.status(200).json({
      message: "product delete successfully ",
      code: 200,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }

}

module.exports = {
  createproduct,
  getallproduct,
  editproduct,
  deleteproduct
};
