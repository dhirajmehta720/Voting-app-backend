import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  aadharNumber: {
    type: Number,
    required: true,
    unique: [true, "aadharNumber already exists"],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["voter", "admin"],
    default: "voter",
  },
  isVoted: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function(next){
  if (!this.isModified("password"))return next();
  this.password = await bcryptjs.hash(this.password, 10);
  next();
})

userSchema.methods.isPasswordCorrect = async function(pwd){
  return await bcryptjs.compare(pwd, this.password);
}

userSchema.methods.generateJWT = function() {
  return jwt.sign(
    {
      _id : this._id,
      email: this.email,
      aadharNumber: this.aadharNumber,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "10d",
    }
  )
}

export const User = mongoose.model("User", userSchema);
