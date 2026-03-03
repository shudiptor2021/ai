import type { AxiosInstance } from "axios";

interface ToggleParams {
    privateApi: AxiosInstance;
    id: string;
}

// fetch all publish data
export const fetchPublishedData = async (privateApi: AxiosInstance) => {
  try {
    const { data } = await privateApi.get("/user/get-publish-creations");

    return data.creations;
  } catch (error: any) {
    throw error;
  }
};

// toggle like
export const toggleLike = async ({
  privateApi,
  id,
}: ToggleParams) => {
  try {
    const { data } = await privateApi.post("/user/toggle-like-creation", {
     id
    });
    return data;
  } catch (error: any) {
    throw error;
  }
};