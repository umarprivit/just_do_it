import Transaction from "../models/Transaction.js";

export const createTransaction = async (req, res) => {
  const { task, provider, amount } = req.body;

  const platformFee = amount * 0.1;

  const transaction = await Transaction.create({
    task,
    client: req.user._id,
    provider,
    amount,
    platformFee,
    status: "paid",
    paidAt: Date.now(),
  });

  res.status(201).json(transaction);
};

export const getTransactionByTask = async (req, res) => {
  const { taskId } = req.params;

  const transaction = await Transaction.findOne({ task: taskId });
  if (!transaction)
    return res.status(404).json({ error: "Transaction not found" });

  res.json(transaction);
};
