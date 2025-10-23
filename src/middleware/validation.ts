import { Request, Response, NextFunction } from "express";
import Joi from "joi";

/**
 * Validation middleware helpers using Joi.
 *
 * The `validateBody` higher-order function returns an express middleware that
 * validates `req.body` against the provided Joi schema, strips unknown fields
 * and returns 400 with details when validation fails.
 */
export function validateBody(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error)
      return res
        .status(400)
        .json({
          error: "Validation error",
          details: error.details.map((d) => d.message),
        });
    req.body = value;
    next();
  };
}

/**
 * Schemas used across the API for request validation.
 */
export const registerSchema = Joi.object({
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().allow("", null),
  age: Joi.number().integer().min(0).optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const userUpdateSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  age: Joi.number().integer().min(0).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
});

export const movieSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  year: Joi.number().integer().optional(),
  duration: Joi.number().integer().optional(),
  genres: Joi.array().items(Joi.string()).optional(),
  posterUrl: Joi.string().uri().optional(),
  posterAlt: Joi.string().optional(),
});

export const playbackSchema = Joi.object({
  movieId: Joi.string().required(),
  position: Joi.number().min(0).optional(),
});

export const favoriteSchema = Joi.object({
  movieId: Joi.string().required(),
});

export const ratingSchema = Joi.object({
  movieId: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
});
