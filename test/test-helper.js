const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'PPK',
    url: 'www.google.com',
    user: '6407f886cacf71bb0414e975',
    likes: 20
  },
  {
    title: 'HTML is hard',
    author: 'PPq',
    url: 'www.bing.com',
    user: '6407f886cacf71bb0414e975',
    likes: 2
  },
]

const initialUsers = [
  {
    username:"pepe",
    name: "Pepon",
    password:"abcd"
  },
  {
    username:"pipo",
    name: "Pipon",
    password:"abcd"
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ tittle:'will remove this soon', author:'remove author'})

  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}


module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb,initialUsers
}