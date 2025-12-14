import mongoose from "mongoose";

const adSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['sale', 'rent','wanted'], required: true },
  category: { 
    type: String, 
    enum: ['villa', 'apartment', 'commercial', 'building', 'land', 'floor', 'resthouse'],
    required: true 
  },
  price: { type: String },
  priceFrom: { type: String },
  priceTo: { type: String },
  location: { type: String},
  area: { type: String },
  rooms: { type: String },
  bathrooms: { type: String },
  description: { type: String },
  images: [{ type: String }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  phone: { type: String },    
  whatsapp: { type: String } ,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Ad", adSchema);