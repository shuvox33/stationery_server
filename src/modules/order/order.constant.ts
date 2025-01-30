import mongoose from "mongoose";

export const OrderSchema = new mongoose.Schema({
  transaction: {
    id: { type: String, required: true }, // Ensure this is a string
    bank_status: String,
    sp_code: String,
    sp_message: String,
    transactionStatus: String,
    method: String,
    date_time: Date,
  },
  // Other fields...
});

export const orderSearchableFields = ['product', 'user'];