import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  image: String,
}, { timestamps: true });

// ✅ Unique name *per restaurant*
categorySchema.index({ restaurant: 1, name: 1 }, { unique: true });

export default mongoose.model("Category", categorySchema);
