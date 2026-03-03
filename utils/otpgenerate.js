const otpgenerate = () =>{

   return Math.floor(100000 + Math.random() * 900000);
}
module.exports = otpgenerate
