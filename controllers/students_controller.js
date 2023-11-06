
const Student=require('../model/student');
module.exports.profile=function(req,res){
    res.send('Welcome to Students profile');
}
module.exports.create = function (req, res) {
    

   Student.create({
        name:req.body.name,
        email:req.body.email,
        course:req.body.course,
        city:req.body.city
    })
    .then((student) => {
        return res.redirect('back');
    })
    .catch((error) => {
        console.log('Error in creating a student:', error);
        return res.status(500).send('Error in creating a Student'); // You can customize the error response as needed.
    });
};
