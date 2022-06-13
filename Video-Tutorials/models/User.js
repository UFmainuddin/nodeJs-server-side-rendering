const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, minLength: 4 }, 
  password: { type: String, required: true , minLength:4}, 
})


module.exports = mongoose.model('User', userSchema);