const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username:{
    type: String,
    unique: true,
    required:true,
    minLength:3
  },
  name:String,
  passwordHash: {
    type:String,
    required:true
  },
  /*Los identificadores de los blogs se almacenan como un array de ID de mongo*/
  blogs:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Blog'
    }
  ],
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON',{
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    //The passwordhash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)
module.exports = User