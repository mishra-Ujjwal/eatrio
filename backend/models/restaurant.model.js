import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
  // location: {
  //   type: { type: String, enum: ['Point'], default: 'Point' },
  //   coordinates: { type: [Number] } // [longitude, latitude]
  // },
  address:String,
  menu: [{ type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Owner" },
  isOpen: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Geospatial index for nearby queries
// RestaurantSchema.index({ location: '2dsphere' });

export default mongoose.model("Restaurant", RestaurantSchema);
