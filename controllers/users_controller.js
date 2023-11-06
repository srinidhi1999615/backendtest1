const User=require('../model/user');
const Student=require('../model/student');
module.exports.profile = async function (req, res) {
  try {
    // Check if the user is authenticated
    if (req.cookies.user_id) {
      // Find the user by ID
      const user = await User.findById(req.cookies.user_id);

      if (user) {
        // Retrieve the list of all students
        const students = await Student.find();

        // Render the user profile page with the list of students
        return res.render('users_profile', {
          title: 'UserProfile',
          user: user,
          students: students
        });
      }
    }

    // If the user is not authenticated or the user does not exist, redirect to the signin page
    return res.redirect('/users/signin');
  } catch (err) {
    console.error('Error in rendering user profile:', err);
    return res.status(500).send('Internal Server Error');
  }
};

module.exports.signup=function(req,res){
    return res.render('users_sign_up',{
        title:"User sign up"
    })
}
module.exports.signin=function(req,res){
    return res.render('users_sign_in',{
        title:"User sign in"
    })
}
module.exports.create = async function (req, res) {
    try {
      if (req.body.password !== req.body.confirmPassword) {
        return res.redirect('back');
      }
  
      const existingUser = await User.findOne({ email: req.body.email });
  
      if (!existingUser) {
        const newUser = await User.create(req.body);
        return res.redirect('/users/signin');
      } else {
        return res.redirect('back');
      }
    } catch (err) {
      console.error('Error in creating or finding the user in signup:', err);
      return res.status(500).send('Internal Server Error');
    }
  };
  
  module.exports.createSession = async function (req, res) {
    try {
      // Find the user by email
      const userFound = await User.findOne({ email: req.body.email });
  
      if (!userFound) {
        // User not found
        console.log('yes1')
        return res.redirect('back');
      }
  
      // Check if the provided password matches the stored password
      if (userFound.password !== req.body.password) {
        console.log('yes2')
        return res.redirect('back');
      }
  
      // Create a session by setting a user_id cookie with the user's ID
      res.cookie('user_id', userFound.id);
      return res.redirect('/users/profile');
    } catch (err) {
      console.error('Error in signing in:', err);
      return res.status(500).send('Internal Server Error');
    }
  };
  module.exports.destroySession = function (req, res) {
    // Clear the user_id cookie to destroy the session
    res.clearCookie('user_id');
    // Redirect the user to a page of your choice, e.g., the login page
    res.redirect('/users/signin');
  };
  