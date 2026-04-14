import mongoose,{ Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';


const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
          },
        password: {
            type: String,
            required: true ,
            minlength: 6
        },
        avatar: {
            type: String,
            required: false,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        family:{
                type: mongoose.Schema.Types.ObjectId,   
                ref: 'Family',
            
        },
        refreshToken: {
            type: String,
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        emailVerificationOTP: {
            type: String
        },
        emailVerificationOTPExpiresAt: {
            type: Date
        },
        emailVerificationLastSentAt: {
            type: Date
        }
        
    },
    { timestamps: true }
)

// Hash password before saving
userSchema.pre(`save`,async function(next){
    if(!this.isModified(`password`)){
        return ;
    }   
    this.password = await bcrypt.hash(this.password, 10);
    
})

// Method to compare password
userSchema.methods.comparepassword = async function(password){
    return bcrypt.compare(password,this.password);

}
// Method to generate access token
userSchema.methods.generateaccesstoken= function(){
    return jwt.sign(
        { id: this._id,
            role: this.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    )
}

// Method to generate refresh token
userSchema.methods.generaterefreshtoken= function(){
    return jwt.sign(
        { id: this._id,     
        role: this.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    )
}

userSchema.methods.generateEmailVerificationOTP = function(){
    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    this.emailVerificationOTP = otpHash;
    this.emailVerificationOTPExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    this.emailVerificationLastSentAt = new Date();

    return otp;
}

export const User = mongoose.model('User', userSchema);
