const mongoose = require("mongoose");

const buyproductSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    name: {
      type: String,
      required: true,
    },
    stock: Number,

    totalprice:Number,

    quantity: {
      type: Number,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      require: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("buyproduct", buyproductSchema);
