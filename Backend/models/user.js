import { Schema, model } from "mongoose";

const userSchema = new Schema({
    firebaseUid: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist5&backgroundColor=9bf6ff,a0c4ff,ffc6ff"
    },
    college: {
        type: String,
        required: true,
    },
    interests: {
        type: [String],
        required: true,
        validate: {
            validator: function (arr) {
                return arr.length >= 1 && arr.length <= 4;
            },
            message: 'Interests must be between 1 and 4 items.'
        }
    },
    year: {
        type: Number,
        required:true
    },
}, { timestamps: true });

const USER = model("USER", userSchema);

export default USER;


