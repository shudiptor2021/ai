import type { AxiosInstance } from "axios";

interface GenerateArticleParams {
  privateApi: AxiosInstance;
  prompt: string;
  selectedLength: {
    length: number;
    text: string;
  };
}

interface GenerateBlogTitleParams {
  privateApi: AxiosInstance;
  prompt: string;
}

interface GenerateImageParams {
  privateApi: AxiosInstance;
  prompt: string;
  publish: boolean;
}

interface EditImageParams {
  privateApi: AxiosInstance;
  formData: FormData;
}

// fetch all content
export const fetchAllContent = async (privateApi: AxiosInstance) => {
  try {
    const { data } = await privateApi.get("/user/get-user-creations");

    return data.creations;
  } catch (error: any) {
    throw error;
  }
};

// create article
export const generateArticle = async ({
  privateApi,
  prompt,
  selectedLength,
}: GenerateArticleParams) => {
  try {
    const { data } = await privateApi.post("/ai/generate-article", {
      prompt,
      length: selectedLength.length,
    });
    return data.content;
  } catch (error: any) {
    throw error;
  }
};

// create blog title
export const generateBlogTitle = async ({
  privateApi,
  prompt,
}: GenerateBlogTitleParams) => {
  try {
    const { data } = await privateApi.post("/ai/generate-blog-title", {
      prompt,
    });
    return data.content;
  } catch (error: any) {
    throw error;
  }
};

// create image
export const generateImage = async ({
  privateApi,
  prompt,
  publish,
}: GenerateImageParams) => {
  try {
    const { data } = await privateApi.post("/ai/generate-image", {
      prompt,
      publish,
    });
    return data.content;
  } catch (error: any) {
    throw error;
  }
};

// remove background
export const removeBackground = async ({
  privateApi,
  formData,
}: EditImageParams) => {
  try {
    const { data } = await privateApi.post(
      "/ai/remove-image-background",
      formData,
    );
    return data.content;
  } catch (error: any) {
    throw error;
  }
};

// remove object
export const removeObject = async ({
  privateApi,
  formData,
}: EditImageParams) => {
  try {
    const { data } = await privateApi.post("/ai/remove-image-object", formData);
    return data.content;
  } catch (error: any) {
    throw error;
  }
};

// review cv/resume
export const reviewResume = async ({
  privateApi,
  formData,
}: EditImageParams) => {
  try {
    const { data } = await privateApi.post("/ai/resume-review", formData);
    return data.content;
  } catch (error: any) {
    throw error;
  }
};
