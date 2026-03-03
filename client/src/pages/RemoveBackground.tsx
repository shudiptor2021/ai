import { Eraser, Sparkles } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import usePrivateAxios from "../api/privateAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeBackground } from "../api/contents";

const RemoveBackground = () => {
  const [input, setInput] = useState<File | null>(null);
  const privateApi = usePrivateAxios();
  const queryClient = useQueryClient();

  const formData = new FormData();
  formData.append("image", input as File);

  const { mutate, isPending, data } = useMutation({
    mutationFn: () => removeBackground({ privateApi, formData }),
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
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700 ">
      {/* left col */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#ff4938]" />
          <h1 className="text-xl font-semibold">Background Removal</h1>
        </div>
        {/* input */}
        <p className="mt-6 text-sm font-medium">Upload image</p>
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length > 0) {
              setInput(e.target.files[0]);
            }
          }}
          type="file"
          accept="image/*"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          required
        />

        {/* Article Length */}
        <p className="mt-1 text-xs text-gray-500 font-light">
          Supports JPG, PNG, and other image formats
        </p>

        <button
          disabled={isPending}
          className="w-full flex justify-center items-center gap-2 bg-linear-to-r from-[#f6ab41] to-[#ff4938] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
        >
          {isPending ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Eraser className="w-5" />
          )}
          Remove background
        </button>
      </form>

      {/* right col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 ">
        <div className="flex items-center gap-3">
          <Eraser className="w-5 h-5 text-[#ff4938] " />
          <h1 className="text-xl font-semibold">Processed image</h1>
        </div>

        {!data ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Eraser className="w-9 h-9" />
              <p>
                Upload an image and click "Remove Background" to get started
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full">
            <img src={data} alt="image" className="w-full h-full" />
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveBackground;
