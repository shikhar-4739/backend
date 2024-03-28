import mongoose, {Schema} from "mongoose";


const subscriptionSchema = new Schema(
    {
        subscriber: {
            type: Schema.Types.ObjectId,      // one who is sunscribing
            ref: "User"
        },
        channel: {
            type: Schema.Types.ObjectId,      // jisko subscribe kar rahe hai
            ref: "User"
        }
}, {timestamps: true})

export const Subscription = mongoose.model("Subscription",subscriptionSchema)