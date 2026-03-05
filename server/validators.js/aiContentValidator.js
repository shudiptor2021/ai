import Joi from "joi";

// article schema
export const articleJoiSchema = Joi.object({
  prompt: Joi.string().required(),
  length: Joi.number().required(),
});

// blog title schema
export const blogTitleJoiSchema = Joi.object({
  prompt: Joi.string().required(),
});

// generate image schema
export const imageJoiSchema = Joi.object({
  prompt: Joi.string().required(),
  publish: Joi.boolean().optional(),
});

// remove background
export const removeBgJoiSchema = Joi.object({
  file: Joi.object({
    mimetype: Joi.string()
      .valid("image/png", "image/jpeg", "image/jpg", "image/webp")
      .required(),
    size: Joi.number()
      .max(5 * 1024 * 1024)
      .required()
      .messages({
        "number.max": "Resume file size exceeds 5MB",
      }), // max 5MB
  }).unknown().required(),
});

// remove object
export const removeObjectJoiSchema = Joi.object({
  object: Joi.string().required().messages({
    "string.empty": "Object to remove is required",
  }),

  file: Joi.object({
    mimetype: Joi.string()
      .valid("image/png", "image/jpeg", "image/jpg", "image/webp")
      .required(),

    size: Joi.number()
      .max(5 * 1024 * 1024)
      .required()
      .messages({
        "number.max": "Resume file size exceeds 5MB",
      }),
  }).unknown().required(),
});

// review resume
export const reviewResumeJoiSchema = Joi.object({
  file: Joi.object({
    mimetype: Joi.string().valid("application/pdf").required().messages({
      "any.only": "Only PDF files are allowed",
    }),

    size: Joi.number()
      .max(5 * 1024 * 1024)
      .required()
      .messages({
        "number.max": "Resume file size exceeds 5MB",
      }),

    originalname: Joi.string().required(),
  }).unknown().required(),
});
