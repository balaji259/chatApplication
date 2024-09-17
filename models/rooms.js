const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const roomSchema = new Schema({
    roomName: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 30
    },
    createdBy: {
        type: String, // Store creator's name directly as string
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    memberCount: {
        type: Number,
        default: 0
    },
    members: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }] // Reference User ObjectId
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;