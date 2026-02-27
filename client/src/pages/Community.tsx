import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

interface PublishData {
  _id: string;
  user_id: string;
  prompt: string;
  content: string;
  type: string;
  publish: true;
  likes: string[];
  created_at: string;
  updated_at: string;
}

const Community = () => {
  const [creations, setCreations] = useState<PublishData[]>([]);
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(true);
  // console.log(typeof user?.id)

  const { getToken } = useAuth();

  const fetchCreations = async () => {
    try {
      const { data } = await axios.get("/user/get-publish-creations", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setCreations(data.creations);
        // console.log(data.creations)
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const imageLikeToggle = async (id: string) => {
    // try {
    //   const { data } = await axios.post("/user/toggle-like-creation", {id},{
    //     headers: { Authorization: `Bearer ${await getToken()}` },
    //   });

    //   if (data.success) {
    //     toast.success(data.message);
    //     await fetchCreations();
    //   } else {
    //     toast.error(data.message);
    //   }
    // } catch (error: any) {
    //   toast.error(error.message);
    // }
    if (!user) return;

    const userId = user.id;

    // 1️⃣ Optimistic update (instant UI change)
    setCreations((prev) =>
      prev.map((creation) =>
        creation._id === id
          ? {
              ...creation,
              likes: creation.likes.includes(userId)
                ? creation.likes.filter((uid) => uid !== userId)
                : [...creation.likes, userId],
            }
          : creation,
      ),
    );

    try {
      // 2️⃣ Call backend (no refetch)
      const { data } = await axios.post(
        "/user/toggle-like-creation",
        { id },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        },
      );

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error("Something went wrong");

      // 3️⃣ Revert if failed
      setCreations((prev) =>
        prev.map((creation) =>
          creation._id === id
            ? {
                ...creation,
                likes: creation.likes.includes(userId)
                  ? creation.likes.filter((uid) => uid !== userId)
                  : [...creation.likes, userId],
              }
            : creation,
        ),
      );
    }
  };

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);

  return !loading ? (
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      <h1>Creations</h1>
      <div className="bg-white h-full w-full rounded-xl overflow-y-scroll">
        {creations.map((creation) => (
          <div
            key={creation._id}
            className="relative group inline-block pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3"
          >
            <img
              src={creation.content}
              alt=""
              className="w-full h-full object-cover rounded-lg"
            />

            <div className="absolute bottom-0 top-0 right-0 left-3 flex gap-2 items-end justify-end group-hover:justify-between p-3 group-hover:bg-linear-to-b from-transparent to-black/80 text-white rounded-lg">
              <p className="text-sm hidden group-hover:block">
                {creation.prompt}
              </p>
              <div className="flex gap-1 items-center">
                <p>{creation.likes.length}</p>
                <Heart
                  onClick={() => imageLikeToggle(creation._id)}
                  className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${creation.likes.includes(user?.id || "") ? "fill-red-500 text-red-600" : "text-white"}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-full">
      <span className="w-10 h-10 rounded-full border-3 border-blue-500 border-t-transparent animate-spin"></span>
    </div>
  );
};

export default Community;
