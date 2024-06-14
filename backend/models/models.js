import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile_picture: {
        type: String,
        default: 'https://www.nicepng.com/png/full/128-1280406_view-user-icon-png-user-circle-icon-png.png'
    },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    favorites: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const friendRequestSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });

const FriendRequest = mongoose.model('Friend_Request', friendRequestSchema);

const chatSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    time: { type: Date, default: Date.now }
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);

const groupSchema = new Schema({
    name: { type: String, required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    group_admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dp: { type: String, default: '' },
}, { timestamps: true });

const Group = mongoose.model('Group', groupSchema);

const roomSchema = new Schema({
    room_name: { type: String, required: true },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);

const roomMemberSchema = new Schema({
    room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    added_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    is_room_admin: { type: Boolean, default: false }
}, { timestamps: true });

const RoomMember = mongoose.model('Room_Member', roomMemberSchema);

export { User, FriendRequest, Chat, Group, Room, RoomMember };