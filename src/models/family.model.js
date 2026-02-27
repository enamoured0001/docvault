import mongoose, {Schema} from 'mongoose';

const familySchema = new Schema({
    name: {
        type: String,
        required: true, 
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdby:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true      
    }
},
{ timestamps: true }
)


export const Family = mongoose.model('Family', familySchema);