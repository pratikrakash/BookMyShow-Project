const jsonwebtoken = require("jsonwebtoken");
const validateToken = (req, res, next) => {
    try {
        const token = req?.headers?.authorization.split(" ")[1];
        const decodedToken = jsonwebtoken.verify(token, process.env.PRIVATE_KEY);
        const currentTime = Date.now()/1000;
        if (currentTime > decodedToken.exp) {
            return res.status(401).send({
                success: false,
                message: "Expired/Invalid token" 
            })
        }
        else {
            req.body.userId = decodedToken.userId;
            next();
        }
    }
    catch (error) {
        res.send({
            success:false,
            message:"Invalid token"
        })
    }

}
module.exports = {
    validateToken
}