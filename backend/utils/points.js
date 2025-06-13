import User from "../models/User.js";

export const awardPoints = async (userId, points) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.points = (user.points || 0) + points;
  await user.save();
  return user.points;
};

export const deductPoints = async (userId, points) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.points = Math.max(0, (user.points || 0) - points);
  await user.save();
  return user.points;
};
