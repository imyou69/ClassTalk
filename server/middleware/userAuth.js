import jwt from "jsonwebtoken";
import express from 'express';
const app = express();

app.use(express.json());

const userAuth = async(req, res, next) => {
    const {token} = req.cookies;

    if(!token){
        return res.json({success: false, message: 'Not Authorized. Login again'})
    }
    try{
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

        if(tokenDecode.id){
            if(!req.body) req.body = {};
            req.body.userId = tokenDecode.id
        }else{
            return res.json({success: false, message: 'Not Authorized. Login again'})
        }
        next();
    }catch(error){
        res.json({success: false, message: error.message});
    }
}

export default userAuth;