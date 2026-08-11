import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { requireAuth, requireRole } from "../../middleware/auth.middleware";
import {
  createReview,
  deleteReview,
  getReview,
  listReviews,
  listMyReviews,
  listAdminReviews,
  listPendingReviewProducts,
  voteOnReviewHelpfulness,
  updateReview,
} from "./reviews.controller";
import {
  createReviewSchema,
  adminReviewListQuerySchema,
  adminReviewsSchema,
  myReviewListQuerySchema,
  myReviewsSchema,
  pendingReviewProductSchema,
  reviewListQuerySchema,
  reviewHelpfulnessSchema,
  reviewMessageSchema,
  reviewParamsSchema,
  reviewSchema,
  updateReviewSchema,
} from "./reviews.schemas";

const messageResponse = (description: string) => ({
  content: { "application/json": { schema: reviewMessageSchema } },
  description,
});

export const listReviewsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Reviews"],
  request: { query: reviewListQuerySchema },
  responses: {
    200: {
      content: { "application/json": { schema: reviewSchema.array() } },
      description: "Reviews for a product",
    },
  },
});

export const getReviewRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Reviews"],
  request: { params: reviewParamsSchema },
  responses: {
    200: {
      content: { "application/json": { schema: reviewSchema } },
      description: "A review",
    },
    404: messageResponse("Review not found"),
  },
});

export const listMyReviewsRoute = createRoute({
  method: "get",
  path: "/my-reviews",
  tags: ["Reviews"],
  middleware: requireAuth,
  request: { query: myReviewListQuerySchema },
  responses: {
    200: {
      content: { "application/json": { schema: myReviewsSchema } },
      description: "Reviews left by the current user",
    },
    401: messageResponse("Authentication is required"),
  },
});

export const listAdminReviewsRoute = createRoute({
  method: "get",
  path: "/admin",
  tags: ["Reviews"],
  middleware: requireRole("admin"),
  request: { query: adminReviewListQuerySchema },
  responses: {
    200: {
      content: { "application/json": { schema: adminReviewsSchema } },
      description: "Reviews for administration",
    },
  },
});

export const createReviewRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Reviews"],
  middleware: requireAuth,
  request: {
    body: { content: { "application/json": { schema: createReviewSchema } } },
  },
  responses: {
    201: {
      content: { "application/json": { schema: reviewSchema } },
      description: "Review created",
    },
    400: messageResponse("Product is unavailable"),
    401: messageResponse("Authentication is required"),
    409: messageResponse("The user has already reviewed this product"),
  },
});

export const listPendingReviewProductsRoute = createRoute({
  method: "get",
  path: "/pending-reviews",
  tags: ["Reviews"],
  middleware: requireAuth,
  responses: {
    200: {
      content: {
        "application/json": { schema: pendingReviewProductSchema.array() },
      },
      description: "Paid-order products the current user has not reviewed",
    },
    401: messageResponse("Authentication is required"),
  },
});

export const updateReviewRoute = createRoute({
  method: "patch",
  path: "/{id}",
  tags: ["Reviews"],
  middleware: requireAuth,
  request: {
    params: reviewParamsSchema,
    body: { content: { "application/json": { schema: updateReviewSchema } } },
  },
  responses: {
    200: {
      content: { "application/json": { schema: reviewSchema } },
      description: "Review updated",
    },
    401: messageResponse("Authentication is required"),
    403: messageResponse("Only the owner or an admin may update this review"),
    404: messageResponse("Review not found"),
  },
});

export const deleteReviewRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Reviews"],
  middleware: requireAuth,
  request: { params: reviewParamsSchema },
  responses: {
    200: messageResponse("Review deleted"),
    401: messageResponse("Authentication is required"),
    403: messageResponse("Only the owner or an admin may delete this review"),
    404: messageResponse("Review not found"),
  },
});

export const voteOnReviewHelpfulnessRoute = createRoute({
  method: "post",
  path: "/{id}/helpfulness",
  tags: ["Reviews"],
  middleware: requireAuth,
  request: {
    params: reviewParamsSchema,
    body: {
      content: { "application/json": { schema: reviewHelpfulnessSchema } },
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: reviewSchema } },
      description: "Review helpfulness count updated",
    },
    401: messageResponse("Authentication is required"),
    404: messageResponse("Review not found"),
  },
});

export const reviewsRouter = new OpenAPIHono();
reviewsRouter.openapi(listReviewsRoute, listReviews);
reviewsRouter.openapi(listMyReviewsRoute, listMyReviews);
reviewsRouter.openapi(listAdminReviewsRoute, listAdminReviews);
reviewsRouter.openapi(
  listPendingReviewProductsRoute,
  listPendingReviewProducts,
);
reviewsRouter.openapi(getReviewRoute, getReview);
reviewsRouter.openapi(createReviewRoute, createReview);
reviewsRouter.openapi(updateReviewRoute, updateReview);
reviewsRouter.openapi(deleteReviewRoute, deleteReview);
reviewsRouter.openapi(voteOnReviewHelpfulnessRoute, voteOnReviewHelpfulness);
