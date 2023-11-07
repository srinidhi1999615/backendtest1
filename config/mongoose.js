const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/srinidhibackendtest1dev');
const db=mongoose.connection;
db.on('error',console.error.bind(console,"Error Connecting to the database"));
db.once('open',function(){
    console.log("Connected to the database:: MongoDB");
})
module.exports=db;