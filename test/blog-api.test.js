/*SUPERTEST SE COMPORTA COMO UN SERVIDOR CON UN PUERTO PARA PRUEBAS, JEST OTORGA FUNCIONES DE TEST */
const mongoose = require ('mongoose')
const supertest = require ('supertest')
const helper = require ('./test-helper')
const app = require ('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)

let USER = {}


describe('blog test', () => {

  beforeEach(async () => {
  /*Borra los blogs y agrega los blog inciales */
    await Blog.deleteMany({})
    await User.deleteMany({})
    console.log('cleared')
    /*Agrega los usuarios iniciales */
    for(let user of helper.initialUsers){
      await api.post('/api/users').send(user)
    }
    /*Inicia sesion y obtiene el token de inicio de sesión */
    const response = await api.post('/api/login').send({
      username:'pepe',
      password:'abcd'
    })
    USER = response.body
    /*Agrega blogs con el id del usuario en sesión */
    for(let blog of helper.initialBlogs){
      await api.post('/api/blogs').send(blog).set('Authorization', 'bearer ' + USER.token)
    }

  })

  test('amount of blogs are correct', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization',  `bearer ${USER.token}`)
      .expect('Content-Type', /json/)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })


  test('the unique identifier name is id', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization',  `bearer ${USER.token}`)

    expect(response.body[0].id).toBeDefined()

  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'HTML is a language',
      author: 'PPA',
      url: 'www.yahoo.com',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization',  `bearer ${USER.token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs').set('Authorization',  `bearer ${USER.token}`)
    const tittles = response.body.map(e => e.title)

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(tittles).toContain('HTML is a language')

  })

  test('the default likes value is 0', async () => {
    const newBlog = {
      title: 'HTML is a language',
      author: 'PPA',
      url: 'www.yahoo.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization',  `bearer ${USER.token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs').set('Authorization',  `bearer ${USER.token}`)
    const like = response.body.find(e => e.title =='HTML is a language').likes
    expect(like).toBe(0)

  })

  test('the tittle and the url are required values', async () => {
    const newBlog = {
      author: 'PPA',
      likes: 10
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization',  `bearer ${USER.token}`)
      .expect(400)
  })

  test('a blog can be removed', async () => {
    const blogs = await api.get('/api/blogs').set('Authorization',  `bearer ${USER.token}`)
    const id = blogs.body[1].id

    await api
      .delete(`/api/blogs/${id}`).set('Authorization',  `bearer ${USER.token}`)
      .expect(204)
  })

  test('a blog can be updated', async () => {
    const blogData = {
      title: 'HTML is a language',
      author: 'PPA',
      url: 'www.yahoo.com',
      likes: 20
    }

    const blogs = await api.get('/api/blogs').set('Authorization',  `bearer ${USER.token}`)
    const id = blogs.body[1].id

    await api
      .put(`/api/blogs/${id}`)
      .set('Authorization',  `bearer ${USER.token}`)
      .send(blogData)

    const response = await api.get('/api/blogs').set('Authorization',  `bearer ${USER.token}`)
    const likes = response.body.find(e => e.id == id).likes
    expect(likes).toBe(20)
  })

  test('a blog cant be added if a token wasnt send', async () => {
    const newBlog = {
      title: 'C++',
      author: 'C#',
      url: 'www.bing.com',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })
})


/*describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name:'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('can not create a username less than 3 characters', async () => {
    const newUser = {
      username: 'ab',
      name:'testname',
      password:'passwod'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('can not create a password less than 3 characters', async () => {
    const newUser = {
      username: 'testuser',
      name:'testname',
      password:'pas'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })
})
*/


afterAll(() => {
  mongoose.connection.close()
})