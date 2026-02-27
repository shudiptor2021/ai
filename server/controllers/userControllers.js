import Content from "../models/aiContent.model.js";

export const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth();
    const creations = await Content.find({ user_id: userId }).sort({
      created_at: -1,
    });

    res.status(200).json({ success: true, creations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPublishCreations = async (req, res) => {
  try {
    const creations = await Content.find({ publish: true }).sort({
      created_at: -1,
    });

    res.status(200).json({ success: true, creations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleLikeCreation = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const creation = await Content.findById(id);

    if (!creation) {
      return res
        .status(400)
        .json({ success: false, message: "Creation not found!" });
    }

    const userIdString = userId.toString();
    const isLiked = creation.likes.includes(userIdString);

    const updatedCreation = await Content.findByIdAndUpdate(
      id,
      isLiked
        ? { $pull: { likes: userIdString } }
        : { $addToSet: { likes: userIdString } },
      { returnDocument: "after" } 
    );

    res.status(200).json({
      success: true,
      message: isLiked ? "Creation Unliked" : "Creation Liked",
      likesCount: updatedCreation.likes.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
