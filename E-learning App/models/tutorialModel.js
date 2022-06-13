const mongoose = require('mongoose');


const tutorialSchema = new mongoose.Schema({
  title: { type: String, required: true }, 
  description: { type: String, required: true, maxLength: 300 }, 
  imageUrl: { type: String, required: true },
  date: { type: Date, default: Date.now()},
  isPublic: {type: String},
  creatorId: {type:String, required:true},
  enrolledArr: {type:Array, default: [null], required: true}
   
})

// Image Validation
tutorialSchema.path('imageUrl').validate(function () { 
  let pattern = /^http(s)?\:\/\/.*/i;
  return pattern.test(this.imageUrl)
}, 'Must be a correct url')

module.exports = mongoose.model('Tutorial', tutorialSchema);
