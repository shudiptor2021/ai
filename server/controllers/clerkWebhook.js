import { Webhook } from "svix";
import User from "../models/user.model.js";

const clerkWebhooks = async (req, res) => {
  try {
    const payload = req.body;
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const evt = wh.verify(payload, headers);
    const { type, data } = evt;

    const email = data.email_addresses?.[0]?.email_address;
    const userName = `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim();

    switch (type) {
      case "user.created": {
        const existingUser = await User.findById(data.id);

        if (!existingUser) {
          const userData = {
            _id: data.id,
            userName,
            email,
            image: data.image_url,
          };
          console.log("Creating user:", data.id, data.email_addresses, data.first_name, data.last_name);

          await User.create(userData);
        }
        break;
      }

      case "user.updated": {
        const userData = {
          userName,
          email,
          image: data.image_url,
        };

        await User.findByIdAndUpdate(data.id, userData);
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        break;
      }
      default:
        break;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).json({ success: false });
  }
};

export default clerkWebhooks;
