import { User } from "../models/user.model.js";
import { jwtVerify } from "../utils/jwt.utils.js";



const authentication = async (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Unauthorized, Login and Try Again"
            });
        }

        const token = authHeader.split(" ")[1];
        const decode = await jwtVerify(token)
        const user = await User.findById(decode.id)

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized User, Login and Try Again"
            });
        }

        req.user = user
        next()
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" })
    }
}


const authorization = (roles) => {
    return (req, res, next) => {
        try {

            const user = req.user;
            if (!roles.includes(user.role)) {
                return res.status(403).json({
                    message: "You Don't Have Permission To Access This Resource"
                });
            }
            next();

        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: "Intenal Server Error"
            })
        }
    }
}



export {
    authentication,
    authorization,
}