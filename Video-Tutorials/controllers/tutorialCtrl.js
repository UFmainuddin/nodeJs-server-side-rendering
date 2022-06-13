const Tutorial = require('../models/tutorialModel');



exports.getHome = async (req, res) => { 
    const isAuth = req.session.isLoggedIn;
    if(isAuth){
        let tutorials = await Tutorial.find({}).lean()


        res.render('user-home.hbs', {tutorials, title: 'User Home', username: req.user.username})

    }else{
        //guest page
        let tutorials = await Tutorial.find({}).lean()

        //filter if it's public
        tutorials = tutorials.filter(tutorial=> tutorial.hasOwnProperty('isPublic'));

        // sort the public array based on enrollment count
        tutorials = tutorials.sort((a, b)=>{
           return b.enrolledArr.length - a.enrolledArr.length
        })

        res.render('guest-home.hbs', {title: 'Guest Home', tutorials})
    }
}

exports.getCreate = (req, res)=>{
    res.render('create-course.hbs', {title: 'Create Course'})
}

exports.postCreate = async (req, res)=>{
    const { title, description, imageUrl, isPublic } = req.body;
  const tutorial = new Tutorial({ title, description, imageUrl, isPublic, date : Date.now(), creatorId: req.user._id, enrolledArr: [] });
  await tutorial.save()
    
  req.flash('success', 'Course created successfully !');

  res.redirect('/')
}

exports.getDetails = async(req, res) => { 
 
    const id = req.params.tutorialId

    let tutorial = await Tutorial.findById(id).lean();
        
        // Authorization 
        let owner = false; 
        if (req.user) { 
            owner = req.user._id.toString() === tutorial.creatorId
        }
      
        // Enrolled or not 
        let enrolled = tutorial.enrolledArr.includes(req.user._id.toString()) 
        console.log(enrolled)

        

    if (tutorial) { 
      res.render('course-details', {title:`Detail | ${id}`, tutorial, owner, enrolled})
    }
  }

  exports.getEdit = async(req, res) => { 

    const id = req.params.tutorialId

    const tutorial = await Tutorial.findById(id).lean();
  
    res.render('edit-course.hbs', {title:'Edit Course', tutorial})
  
  }
  exports.postEdit = async (req, res) => { 

    const id = req.params.tutorialId

    const tutorial = await Tutorial.findById(id);
 
    tutorial.title = req.body.title;
    tutorial.description = req.body.description;
    tutorial.imageUrl = req.body.imageUrl;
    tutorial.isPublic = req.body.isPublic;

    await tutorial.save();
    req.flash('success', 'Course edited successfully !');
    res.redirect('/');
  }

  exports.getDelete = async(req, res) => { 

    const id = req.params.tutorialId

    const tutorial = await Tutorial.findById(id).lean();
  
    res.render('delete.hbs', {title:'Delete course', tutorial})
  
  }
  exports.postDelete = async (req, res) => { 

    const id = req.params.tutorialId

    await Tutorial.findByIdAndDelete(id)

    req.flash('success', 'Course deleted successfully !');
  
    res.redirect('/')

  }

  exports.getEnroll = async(req, res) => { 

    const id = req.params.tutorialId

   let tutorial = await Tutorial.findById(id)


    //Push the id in the enrolled Array
   tutorial.enrolledArr.push(req.user._id.toString())

   await tutorial.save();
    req.flash('success', 'You have enrolled successfully!');
    res.redirect(`/details/${id}`)
  
  }