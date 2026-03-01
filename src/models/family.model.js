import mongoose, {Schema} from 'mongoose';

const familySchema = new Schema({
    name: {
        type: String,
        required: true, 
    },
    members: [
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      role: {
         type: String,
         enum: ["admin", "member"],
         default: "member"
      }
   }
],

    createdby:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true      
    }
},
{ timestamps: true }
)


export const Family = mongoose.model('Family', familySchema);