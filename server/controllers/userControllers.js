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

    const currentLikes = creation.likes;
    const userIdString = userId.toString();
    let updatedLikes;
    let message;

    if (currentLikes.includes(userIdString)) {
      updatedLikes = currentLikes.filter((user) => user !== userIdString);
      message = "Creation Unliked";
    } else {
      updatedLikes = [...currentLikes, userIdString];
      message = "Creation Liked";
    }

    await Content.findByIdAndUpdate(id, { likes: updatedLikes });

    res
      .status(200)
      .json({ success: true, message, likesCount: updatedLikes.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
