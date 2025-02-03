import mongoose from "mongoose";

export const OrderSchema = new mongoose.Schema({
  transaction: {
    id: { type: String, required: true }, 
    bank_status: String,
    sp_code: String,
    sp_message: String,
    transactionStatus: String,
    method: String,
    date_time: Date,
  },
  
});

export const orderSearchableFields = ['product', 'user'];