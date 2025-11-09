import mongoose from "mongoose";
const cartSchema = new mongoose.Schema({
     restaurantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Restaurant",
        required:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    items:[{
        name:{
            type:String,
            required:true,
        },
        price:{
            type:Number,
            required:true,
        },
        quantity:{
            type:Number,
            default:1,
        },
        image:{
            type:String,
            required:true,
        }
    }],
    grandTotal:{
        type:Number,
        required:true,
        default: 0,
    }
}, { timestamps: true })

 cartSchema.pre("save", function (next) {
  this.grandTotal = this.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  next();
});
export default mongoose.model("Cart",cartSchema)
