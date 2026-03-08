import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Scissors, Sparkles } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import usePrivateAxios from "../api/privateAxios";
import { removeObject } from "../api/contents";
import { useAuth } from "@clerk/clerk-react";
import FreePlan from "../components/FreePlan";

const RemoveObject = () => {
  const [input, setInput] = useState<File | null>(null);
  const [object, setObject] = useState("");
  const privateApi = usePrivateAxios();
  const queryClient = useQueryClient();
  const { has } = useAuth();
  const isPremium = has?.({ plan: "premium" });

  const { mutate, isPending, data } = useMutation({
    mutationFn: (formData: FormData) => removeObject({ privateApi, formData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contents"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ??
        error?.response?.data ??
        error?.message ??
        "Something went wrong";
      toast.error(message);
    },
  });

  const onSubmitHandler: React.FormEventHandler<HTMLFormElement> = async (
    e,
  ) => {
    e.preventDefault();
    const value = object;

    // space at start or end
    if (value !== value.trim()) {
      toast.error("Space is not allowed at the beginning or end");
      return;
    }

    // more than one word
    if (value.split(" ").length > 1) {
      toast.error("Please enter only one object name");
      return;
    }

    const formData = new FormData();
    formData.append("image", input as File);
    formData.append("object", object as string);
    mutate(formData);
  };

  // if isn't premium plan
  if (!isPremium) return <FreePlan title={"remove object"} />;
  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700 ">
      {/* left col */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#4a7aff]" />
          <h1 className="text-xl font-semibold">Object Removal</h1>
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

        <p className="mt-6 text-sm font-medium">
          Describe object name to remove
        </p>
        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          rows={4}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="e.g., watch or spoon, Only single object name"
          required
        />

        <button
          disabled={isPending}
          className="w-full flex justify-center items-center gap-2 bg-linear-to-r from-[#417df6] to-[#8e37eb] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
        >
          {isPending ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Scissors className="w-5" />
          )}
          Remove object
        </button>
      </form>

      {/* right col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 ">
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-[#4a7aff] " />
          <h1 className="text-xl font-semibold">Processed image</h1>
        </div>

        {!data ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Scissors className="w-9 h-9" />
              <p>Upload an image and click "Remove Object" to get started</p>
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

export default RemoveObject;
