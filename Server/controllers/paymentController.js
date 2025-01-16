const PaymentHistory = require("../models/PaymentHistory");
const logger = require("../utils/logger");

// Initiate a payment
const initiatePayment = async (req, res) => {
  try {
    const {
      studentId,
      amount,
      gatewayName,
      transactionId,
      yearSem,
      paymentType,
    } = req.body;

    if (
      !studentId ||
      !amount ||
      !gatewayName ||
      !transactionId ||
      !yearSem ||
      !paymentType
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const payment = new PaymentHistory({
      studentId,
      amount,
      gatewayName,
      transactionId,
      yearSem,
      paymentType,
    });

    await payment.save();
    res
      .status(200)
      .json({ message: "Payment initiated successfully", payment });
  } catch (error) {
    console.error("Error initiating payment:", error.message);
    res
      .status(500)
      .json({ message: "Error initiating payment", error: error.message });
  }
};

// Get payment history
const getPaymentHistory = async (req, res) => {
  try {
    // Fetch all payments and populate student details if referenced
    const payments = await PaymentHistory.find()
    res.status(200).json(payments);
  } catch (error) {
    logger.error(`Error fetching payment history: ${error.message}`);
    res.status(500).json({ message: 'Error fetching payment history' });
  }
};

module.exports = { initiatePayment, getPaymentHistory };
