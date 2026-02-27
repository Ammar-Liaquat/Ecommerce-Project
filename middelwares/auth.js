const jwt = require("jsonwebtoken");

const middelware = (req, res, next) => {
  try {
    const auth = req.headers["authorization"];
    const token = auth && auth.split(" ")[1];

    if(!token) return res.status(401).json({
        message:" invalid token or expired token",
        code:401
    })
    const dcode = jwt.verify(token,process.env.SECRET_KEY)
    req.user = dcode
    next() 

  } catch (error) {
    res.status(500).json({
        message:"internal server error",
        code:500,
        error:error.message
    })
  }
}; 

module.exports = {middelware}
