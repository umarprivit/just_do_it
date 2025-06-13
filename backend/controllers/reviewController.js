import Review from "../models/Review.js";

export const createReview = async (req, res) => {
  const { task, reviewee, rating, comment } = req.body;

  const review = await Review.create({
    task,
    reviewer: req.user._id,
    reviewee,
    rating,
    comment,
  });

  res.status(201).json(review);
};

export const getReviewsForUser = async (req, res) => {
  const { userId } = req.params;

  const reviews = await Review.find({ reviewee: userId })
    .populate("reviewer", "name")
    .populate("task", "title");

  res.json(reviews);
};
