import mongoose from "mongoose";

const MatierePremierSchema = new mongoose.Schema({
    reference:{
        type : String,
        required : true,
        unique : true,
    },
    nom : {
        type : String,
        required : true,
    },
    uniteMesure :{
        type : String,
        required : true,
    },
    quantiteDisponible : {
        type : Number,
        default : 0,
        min : 0
    },
    seuilAlerte : {
        type : Number,
        default : 0,
        min : 0
    }
},
{
    timestamps : true
}
);


export const MatierePremiere = mongoose.model("MatierePremiere", MatierePremierSchema);