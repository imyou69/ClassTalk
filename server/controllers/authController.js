import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';
import transporter from '../config/nodeMailer.js';


export const register = async (req, res)=>{
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.json({success: false, message: 'Missing Details'})
    }

    try{

        const existingUser = await userModel.findOne({email})

        if(existingUser){
            return res.json({ success: false, message: 'User already exists'});
        }
        const hashedpassword = await bcrypt.hash(password, 10)

        const user = new userModel({name, email, password: hashedpassword});
        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d'});

        res.cookie('token',token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        // welcome mail
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'welcome to ClassTalk',
            text: `Welcome to ClassTalk. Your account has successfully created with email id: ${email}`
        }
        await transporter.sendMail(mailOptions);
        return res.json({success:true});

    }catch(error){
        res.json({success: false, message: error.message})
    }
}

export const login = async (req, res)=>{
    const{email, password} = req.body;

    if(!email || !password){
        return res.json({success: false, message: 'Email and Password are required'})
    }

    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: 'Invalid email'})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.json({success: false, message: 'Invalid password'})
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d'});

        res.cookie('token',token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({success:true});
    } catch(error){
        return res.json({success: false, message: error.message});
    }
}

export const logout = async (req, res)=>{
    try{
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
        })
        return res.json({success:true, message: "Logged out"})
    }catch(error){
        return res.json({success: false, message: error.message});
    }
}
// sending otp
export const sendVerifyOtp = async(req, res)=>{
    try{
        const {userId} = req.body;
        const user = await userModel.findById(userId);

        if(user.isVerified){
            return res.json({success: false, message: "Account Already Verified"})
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpAt = Date.now() + 24 * 60 * 60 * 1000
        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Your OTP is ${otp}. Verify your account using this code`
        }
        await transporter.sendMail(mailOption);
        res.json({ success: true, message: 'OTP sent successfully' });

    }catch(error){
        res.json({success: false, message: error.message});
    }
}

export const verifyEmail = async(req, res) => {
    const {userId, otp} = req.body;
    if(!userId || !otp) {
        return res.json({success: false, message: 'Missing Details'});
    }
    try{
        const user = await userModel.findById(userId);

        if(!user){
            return res.json({success: false, message: "User not found"});
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({success: false, message:'Invalid OTP'});
        } 

        if(user.verifyOtpExpAt < Date.now()){
            return res.json({success: false, message:'OTP Expired'});
        }
        user.isVerified = true;
        user.verifyOtp =''
        user.verifyOtpExpAt = 0;

        await user.save();
        return res.json({success: true, message: "Verified"});
    }catch(error){
        return res.json({success: false, message: error.message});
    }
}

export const isAuthenticated = async (req, res)=>{
    try{
        return res.json({success: true});
    }catch(error){
        res.json({success: false, message: error.message})
    }
}

export const sendResetOtp = async(req, res) => {
    const {email} = req.body;
    if(!email){
        return res.json({success: false, message: 'Email is requaired'})
    }
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: 'User not found'});
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpAt = Date.now() + 15 * 60 * 1000
        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password OTP',
            text: `Your OTP is ${otp}. Reset your password using this code`
        }
        await transporter.sendMail(mailOption);
        res.json({ success: true, message: 'OTP sent successfully' });
    }catch(error){
        return res.json({success: false, message: error.message})
    }
}

//reset
export const resetPassword = async(req, res)=>{
    const{email,otp,newPassword} = req.body;

    if(!email || !otp || !newPassword){
        return res.json({success: false, message: 'Email, OTP and new password are required'});
    }
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: 'User not found'});
        }
        if(user.resetOtp === "" || user.resetOtp !== otp){
            return res.json({success: false, message:"Invalid Otp"})
        }
        if(user.resetOtpExpAt < Date.now()){
            return res.json({success: false, message: 'OTP expired'})
        }
        const hashedpassword = await bcrypt.hash(newPassword,10);

        user.password = hashedpassword;
        user.resetOtp = '';
        user.resetOtpExpAt = 0;
        await user.save();

        return res.json({success: true, message: "Password changed"})
    }catch(error){
        return res.json({success:false, message:error.message})
    }
}