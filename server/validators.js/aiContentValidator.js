import Joi from "joi";


export const articleJoiSchema = Joi.object({
    prompt: Joi.string().required(),
    length: Joi.number().required(),
});
















// import mongoose from "mongoose";

// const contentSchema = new mongoose.Schema({
//    user_id: {type: String, required: true},
//    prompt: {type: String, required:true },
//    content: {type: String, required:true },
//    type: {type: String, required:true },
//    publish: { type: Boolean, default: false },
//    likes: {type: [String], default: []},
// }, {
//     timestamps: {
//         createdAt: "created_at",
//         updatedAt: "updated_at",
//     }
// });

// const Content = mongoose.model("Content", contentSchema);

// export default Content;