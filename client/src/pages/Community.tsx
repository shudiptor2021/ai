import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import ai_gen_img_1 from "../assets/ai_gen_img_1.png";
import ai_gen_img_2 from "../assets/ai_gen_img_2.png";
import ai_gen_img_3 from "../assets/ai_gen_img_3.png";
import { Heart } from "lucide-react";

interface PublishData {
  id: number;
  user_id: string;
  prompt: string;
  content: string;
  type: string;
  publish: true;
  likes: string[];
  created_at: string;
  updated_at: string;
}

const dummyPublishedCreationData: PublishData[] = [
    {
        "id": 1,
        "user_id": "user_2yMX02PRbyMtQK6PebpjnxvRNIA",
        "prompt": "Generate an image of A Boy is on Boat , and fishing in the style Anime style.",
        "content": ai_gen_img_1,
        "type": "image",
        "publish": true,
        "likes": [
            "user_2yMX02PRbyMtQK6PebpjnxvRNIA",
            "user_2yaW5EHzeDfQbXdAJWYFnZo2bje"
        ],
        "created_at": "2025-06-19T09:02:25.035Z",
        "updated_at": "2025-06-19T09:58:37.552Z",
    },
    {
        "id": 2,
        "user_id": "user_2yMX02PRbyMtQK6PebpjnxvRNIA",
        "prompt": "Generate an image of A Boy Riding a bicycle on road and bicycle is from year 2201  in the style Anime style.",
        "content": ai_gen_img_2,
        "type": "image",
        "publish": true,
        "likes": [
            "user_2yMX02PRbyMtQK6PebpjnxvRNIA",
            "user_2yaW5EHzeDfQbXdAJWYFnZo2bje"
        ],
        "created_at": "2025-06-19T08:16:54.614Z",
        "updated_at": "2025-06-19T09:58:40.072Z",
    },
    {
        "id": 3,
        "user_id": "user_2yaW5EHzeDfQbXdAJWYFnZo2bje",
        "prompt": "Generate an image of a boy riding a car on sky in the style Realistic.",
        "content": ai_gen_img_3,
        "type": "image",
        "publish": true,
        "likes": [
            "user_2yaW5EHzeDfQbXdAJWYFnZo2bje"
        ],
        "created_at": "2025-06-23T11:29:23.351Z",
        "updated_at": "2025-06-23T11:29:44.434Z",
        
    },
]

const Community = () => {
  const [creations, setCreations] = useState<PublishData[]>([]);
  const {user} = useUser();

  const fetchCreations = async () => {
    setCreations(dummyPublishedCreationData)
  };

  useEffect(()=>{
    if(user){
      fetchCreations()
    }
  },[user])

  return (
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      <h1>Creations</h1>
      <div className="bg-white h-full w-full rounded-xl overflow-y-scroll">
        {
          creations.map((creation) => (
            <div key={creation.id} className="relative group inline-block pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3">
              <img src={creation.content} alt="" className="w-full h-full object-cover rounded-lg" />

              <div className="absolute bottom-0 top-0 right-0 left-3 flex gap-2 items-end justify-end group-hover:justify-between p-3 group-hover:bg-linear-to-b from-transparent to-black/80 text-white rounded-lg">
                <p className="text-sm hidden group-hover:block">{creation.prompt}</p>
                <div className="flex gap-1 items-center">
                  <p>{creation.likes.length}</p>
                  <Heart className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${creation.likes.includes(user?.id) ? 'fill-red-500 text-red-600' : 'text-white'}`}/>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Community;
