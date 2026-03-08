import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Hash, Sparkles } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import { generateBlogTitle } from "../api/contents";
import usePrivateAxios from "../api/privateAxios";

const BlogTitles = () => {
  const blogCategories: string[] = [
    "General",
    "Technology",
    "Business",
    "Health",
    "Lifestyle",
    "Education",
    "Travel",
    "Food",
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>("General");
  const [input, setInput] = useState<string>("");
  const privateApi = usePrivateAxios();
  const queryClient = useQueryClient();
  const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedCategory}`;

  const { mutate, isPending, data } = useMutation({
    mutationFn: () => generateBlogTitle({ privateApi, prompt }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contents"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const onSubmitHandler: React.FormEventHandler<HTMLFormElement> = async (
    e,
  ) => {
    e.preventDefault();
    mutate();
  };
  return (
    <div className="h-full p-6 flex items-start flex-wrap gap-4 text-slate-700 ">
      {/* left col */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#8e37eb]" />
          <h1 className="text-xl font-semibold">AI Title Generator</h1>
        </div>
        {/* input */}
        <p className="mt-6 text-sm font-medium">Keyword</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="The future of artificial intelligence is..."
          required
        />

        {/* Article Length */}
        <p className="mt-4 text-sm font-medium">Category</p>
        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {blogCategories.map((item, index) => (
            <span
              key={index}
              onClick={() => setSelectedCategory(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedCategory === item
                  ? "bg-purple-50 text-purple-700"
                  : "text-gray-500 border-gray-300"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
        <br />
        <button
          disabled={isPending}
          className="w-full flex justify-center items-center gap-2 bg-linear-to-r from-[#c341f6] to-[#8e37eb] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
        >
          {isPending ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Hash className="w-5" />
          )}
          Generate title
        </button>
      </form>

      {/* right col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 ">
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5 text-[#8e37eb] " />
          <h1 className="text-xl font-semibold">Generated titles</h1>
        </div>

        {!data ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Hash className="w-9 h-9" />
              <p>Enter a topic and click "Generate title" to get started</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
            <div className="reset-tw">
              <Markdown>{data}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitles;
