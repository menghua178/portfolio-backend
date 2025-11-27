const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  // 新增 email 字段，必须添加！
  email: { type: String, required: true, unique: true }, 
  password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);