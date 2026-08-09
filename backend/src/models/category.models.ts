import { db } from '../config/db.ts';
import { ICategory } from '../types/index.ts';


const CategorySchema = new db.Schema<ICategory>({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    description: {
        type: String,
        trim: true,
    },
},
    {
        timestamps: true,
    });

export const CategoryModel = db.model('Category', CategorySchema);
