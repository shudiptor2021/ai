import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
   user_id: {type: String, required: true},
   prompt: {type: String, required:true },
   content: {type: String, required:true },
   type: {type: String, required:true },
   publish: { type: Boolean, default: false },
   likes: {type: [String], default: []},
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
});

const Content = mongoose.model("Content", contentSchema);

export default Content;














//  {
//         "id": 1,
//         "user_id": "user_2yMX02PRbyMtQK6PebpjnxvRNIA",
//         "prompt": "Generate an image of A Boy is on Boat , and fishing in the style Anime style.",
//         "content": ai_gen_img_1,
//         "type": "image",
//         "publish": true,
//         "likes": [
//             "user_2yMX02PRbyMtQK6PebpjnxvRNIA",
//             "user_2yaW5EHzeDfQbXdAJWYFnZo2bje"
//         ],
//         "created_at": "2025-06-19T09:02:25.035Z",
//         "updated_at": "2025-06-19T09:58:37.552Z",
//     },

