import { Download } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

interface CreationItem {
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

const CreationItems = ({ item }: { item: CreationItem }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(item.content);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = `ai-image-${Date.now()}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      toast.error("Failed to download image");
    }
  };
  const [expanded, setExpanded] = useState<Boolean>(false);
  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="p-4 max-w-5xl text-sm bg-white border border-gray-200 rounded-lg cursor-pointer"
    >
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2>{item.prompt}</h2>
          <p className="text-gray-500">
            {item.type} - {new Date(item.created_at).toLocaleDateString()}{" "}
          </p>
        </div>
        <button className="bg-[#eff6ff] border border-[#bfdbfe] text-[#1e40af] px-4 py-1 rounded-full">
          {item.type}
        </button>
      </div>
      {expanded && (
        <div>
          {item.type === "image" ? (
            <div className="flex flex-col h-full gap-3">
              <img
                src={item.content}
                alt="image"
                className="mt-3 w-full max-w-md"
              />
              <a
              onClick={handleDownload}
              className="flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-md transition"
            >
              <Download className="w-4 h-4" />
              Download Image
            </a>
            </div>
          ) : (
            <div className="mt-3 h-full  text-sm text-slate-700">
              <div className="reset-tw">
                <Markdown>{item.content}</Markdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItems;
