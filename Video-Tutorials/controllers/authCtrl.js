 const User = require('../models/User');
 const bcrypt = require('bcryptjs');
 const salt = 12;


exports.getLogin = (req, res) => { 
  res.render('auth/login.hbs', {title:'Login Page'})
}

exports.getRegister = (req, res) => { 
    res.render("auth/register.hbs", { title: "Register Page" });
}

exports.postRegister = async(req, res, next) => {

	const { username, password, password2  } = req.body;
  
  let userData = await User.find({ username: username })
  if (userData.length > 0) { 
    req.flash('error', 'Username is taken, try another username');
    return res.redirect('/register')
  }
    
	// Hash the password 
  /// not workig for me
	//const hash = await bcrypt.hash(password, salt);

	// Create a new user
	const user = new User({ password, username});

	// store user in the DB
	await user.save();
	req.flash("success", "User created Successfully !");
	res.redirect("/login");
	
}

exports.postLogin = async(req, res) => { 

  const { password, username } = req.body;

  // check if the user exist in my db 
  const user = await User.findOne({ username: username })
  // if the username not in db 
  if (!user) { 
    req.flash('error', 'Invalid email or password');
    return res.redirect('/login')
  }
  

  /////// bcrypt is not working for some reason

  // const match = await bcrypt.compare(password, user.password)
  
  if (password == user.password) { 
    // process to login the user 
    req.session.isLoggedIn = true; 
    req.session.user = user;

    // Store user session in DB
    await req.session.save()
    req.flash('success', 'Logged In successfully !');
    console.log(req.session.isLoggedIn)
   
    return res.redirect('/')
  }

  // if password dosen't match
  req.flash('error', 'Invalid email or password')
  return res.redirect('/login')

}

exports.getLogout = async (req, res) => { 

  await req.session.destroy();
 
  res.redirect('/')

}