const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { 
        type: String, 
        required: true,
        minlength: 3,
        maxlength: 30 
    },
    rooms: [
        {
            roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true }, // Reference Room by ID
            joinedAt: { type: Date, default: Date.now }
        }
    ]
});

const User = mongoose.model('User', userSchema);
module.exports = User;