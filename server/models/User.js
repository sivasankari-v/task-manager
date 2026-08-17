const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: false, default: '' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });

// Password hash - next() ah eduthuten
userSchema.pre('save', async function(){
    if(!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
})

module.exports = mongoose.model('User', userSchema);