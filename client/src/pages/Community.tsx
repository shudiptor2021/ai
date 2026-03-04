import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import usePrivateAxios from "../api/privateAxios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPublishedData, toggleLike } from "../api/user";
import { useUser } from "@clerk/clerk-react";


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
  const { user } = useUser();
  // console.log(typeof user?.id)
  const privateApi = usePrivateAxios();
  const queryClient = useQueryClient();

  // fetch publish data
  const { data, isPending } = useQuery({
    queryKey: ["publish"],
    queryFn: () => fetchPublishedData(privateApi),
    // staleTime: Infinity,
  });

  // handle like toggle
  const { mutate: toggleLikeMutate } = useMutation({
    mutationFn: (id: string) => toggleLike({ privateApi, id }),

    // 🔥 1️⃣ Optimistic update
    onMutate: async (id: string) => {
      if (!user) return;

      await queryClient.cancelQueries({ queryKey: ["publish"] });

      const previousData = queryClient.getQueryData<PublishData[]>(["publish"]);

      queryClient.setQueryData<PublishData[]>(["publish"], (old = []) =>
        old.map((creation) => {
          if (creation._id !== id) return creation;

          const isLiked = creation.likes.includes(user.id);

          return {
            ...creation,
            likes: isLiked
              ? creation.likes.filter((uid) => uid !== user.id)
              : [...creation.likes, user.id],
          };
        }),
      );

      return { previousData };
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },

    // ❌ 2️⃣ Rollback if failed
    onError: (err, id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["publish"], context.previousData);
      }
      toast.error("Something went wrong");
    },

    // 🔄 3️⃣ Sync with server (optional but safe)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["publish"] });
    },
  });

  return !isPending ? (
    <div className="flex-1 h-full flex flex-col gap-4 p-6 relative z-0">
      <h1>Creations</h1>
      <div className="bg-white h-full w-full rounded-xl overflow-y-scroll">
        {data.map((creation: PublishData) => (
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
                  onClick={() => toggleLikeMutate(creation._id)}
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
