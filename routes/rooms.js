const express=require('express');
const roomRoute=express.Router();
const Room=require("../models/rooms.js");
const User=require("../models/users.js");

roomRoute.get("/rooms",async(req,res)=>{
    try{
        const rooms=await Room.find({});
        res.status(200).json(rooms);
    }
    catch(e){
        console.log(e.message);
    }
});

roomRoute.post('/createRoom',async(req,res)=>{

    const {username,newRoom}=req.body;
    if (!username || !newRoom) {
        return res.status(400).json({ message: 'Username and room name are required.' });
    }
    try{
        let existingRoom=await Room.findOne({roomName:newRoom});
        if(existingRoom){

            return res.status(400).json({message:"Room already exists"})

        }
        const room=new Room({
            roomName:newRoom,
            createdBy:username
        });

        await room.save();
        res.status(200).json({message:"Room created Successfully!"});
    }
    catch(e){
        console.log(e.message);
    }
});

roomRoute.post('/joinRoom', async (req, res) => {
    const { username, selectedRoom } = req.body;

    try {
        if (!username || !selectedRoom) {
            return res.status(400).json({ error: 'Username and room are required' });
        }

        // Check if the room exists
        const room = await Room.findOne({ roomName: selectedRoom });
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Check if the user exists
        let user = await User.findOne({ username });
        if (!user) {
            // Create the user if they don't exist
            user = new User({ username });
        }

        // Add user to the room's members if not already present
        if (!room.members.includes(user._id)) {
            room.members.push(user._id);
            room.memberCount += 1;
            await room.save();
        }

        // Add the room to the user's list of joined rooms if not already present
        if (!user.rooms.some(r => r.roomId.equals(room._id))) {
            user.rooms.push({ roomId: room._id, joinedAt: new Date() });
            await user.save();
        }

        res.status(200).json({ message: 'Joined room successfully' });
    } catch (error) {
        console.error('Error joining the room:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

    

module.exports=roomRoute;