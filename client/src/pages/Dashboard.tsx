import { Protect } from "@clerk/clerk-react";
import { Gem, Sparkles } from "lucide-react";
import CreationItems from "../components/CreationItems";
import usePrivateAxios from "../api/privateAxios";
import { fetchAllContent } from "../api/contents";
import { useQuery } from "@tanstack/react-query";

// axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

interface CreationData {
  _id: number;
  user_id: string;
  prompt: string;
  content: string;
  type: string;
  publish: boolean;
  likes: string[];
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const privateApi = usePrivateAxios();

  const { data, isPending } = useQuery({
    queryKey: ["contents"],
    queryFn: () => fetchAllContent(privateApi),
    staleTime: Infinity,
  });

  return (
    <div className="h-full overflow-y-scroll p-6">
      <div className="flex justify-start gap-4 flex-wrap">
        {/* Total creations card */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Total Creations</p>
            <h2 className="text-xl font-semibold">{data?.length}</h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#3588f2] to-[#0bb0d7] text-white flex justify-center items-center">
            <Sparkles className="w-5 text-white" />
          </div>
        </div>

        {/* Active plan card */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Active Plan</p>
            <h2 className="text-xl font-semibold">
              <Protect plan="premium" fallback="Free">
                Premium
              </Protect>
            </h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#ff61c5] to-[#9e53ee] text-white flex justify-center items-center">
            <Gem className="w-5 text-white" />
          </div>
        </div>
      </div>
      {/* recent creations */}
      {isPending ? (
        <div className="flex justify-center items-center h-full">
          <span className="w-10 h-10 rounded-full border-3 border-blue-500 border-t-transparent animate-spin"></span>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="mt-6 mb-4">Recent Creations</p>
          {data.map((item: CreationData) => (
            <CreationItems key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
