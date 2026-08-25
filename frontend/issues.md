reviewRouter.post(
  '/id',
  validateBody(createReviewSchema),
  createProductReview
)

must be 


reviewRouter.post(
  "/:productId",
  validateParams(productIdParamsSchema),
  validateBody(createReviewSchema),
  createProductReview,
);

reviews: {
  create: "/reviews/:productId",
  byId: "/reviews/:id",
},