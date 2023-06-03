//const mongoose = require('mongoose')
const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const { tokenExtractor, userExtractor } = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username:1, name:1 })
  response.json(blogs)
})

blogsRouter.post('/', tokenExtractor, userExtractor, async (request, response, next) => {
  const blog = request.body
  const user = await User.findById(request.user)

  const blogData = new Blog({
    title: blog.title,
    author: blog.author,
    url: blog.url,
    /*Solo se requiere el id para crear la conexion populate*/
    user: user._id,
    likes: blog.likes
  })

  try{
    const savedBlog = await blogData.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.json(savedBlog)
  }catch(exception){
    next(exception)
  }
})

blogsRouter.delete('/:id',tokenExtractor, userExtractor, async (request, response, next) => {
  //const authUserId = request.token.id
  const user = request.user
  try{
    blogToDelete = await Blog.findById(request.params.id)
    if (blogToDelete){
      if(user.toString() ==  blogToDelete.user.toString()){
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
      }else{
        response.status(401).json({ error: 'not authorized blog' })
      }
    }else{
      response.status(401).json({ error: 'Wrong blog' })
    }

  }catch(exception){
    next(exception)
  }
})

blogsRouter.put('/:id',tokenExtractor, async (request, response, next) => {
  const blog = request.body

  const blogData = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes
  }

  try{
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blogData, { runValidators: true, context: 'query', new: true })
    response.json(updatedBlog)
  }catch(exception){
    next(exception)
  }
})

module.exports = blogsRouter