const mongoose=require('mongoose');

const studentSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    course:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    }
},{
    timestamps:true
})
const Student = mongoose.model('Student',studentSchema);
module.exports=Student;