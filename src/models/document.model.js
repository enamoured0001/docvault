import mongoose, {Schema} from 'mongoose';

const documentSchema = new Schema(
    {
        title: {
            type: String,
            required: true,     
        },
        content: {
            type: String,   
            required: true,
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',    
            required: true
        },
        uploadedfile: [{
            type: String,
            enum: ['pdf', 'image']   
        }],
        
    },
    { timestamps: true}
)


export const Document = mongoose.model('Document', documentSchema);