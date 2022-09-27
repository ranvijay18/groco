const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true,
    unique:true
}, 
password:{
    type:String,
    required:true
},
date: {
  type: String,
},
tokens: [
  {
    token: {
      type: String,
      required: true,
    },
  },
],
});

const User = new mongoose.model("User", userSchema);
module.exports = User;
