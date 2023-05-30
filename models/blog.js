const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const blogSchema = new mongoose.Schema({
  title: {
    type:String,
    required:true
  },
  author: String,
  url: {
    type:String,
    required:true,
    unique:true
  },
  likes: { type:Number, default:0 },
  /*Los identificadores de los usuarios se almacenan como un array de ID de mongo*/
  users : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
})
blogSchema.plugin(uniqueValidator)

/*formatear los objetos devueltos por Mongoose NO MUESTRA EL __v ni el id en el frontend*/
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

/*EXPORTA UN OBJETO MODELO DE BD  */
const Blog =  mongoose.model('Blog', blogSchema)
module.exports = Blog