import mongoose from "mongoose";

const ProduitSchema = new mongoose.Schema({
    reference :{
        type : String,
        required : true,
        unique : true,
    },
    nom :{
        type : String,
        required : true
    },
    composition :[{
        matiere : { 
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'MatierePremiere',
        required : true ,    
    },
    
        quantiteUnitaire : {
            type : Number,
            required : true,
            min : 0.000001
        }
    }
    ]
},
{
    timestamps : true
}
);

export const Produit = mongoose.model("Produit" , ProduitSchema);