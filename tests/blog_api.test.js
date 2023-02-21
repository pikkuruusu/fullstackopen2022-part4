const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)

    await blogObject.save()
  }
})

describe('when there are two blogs initially in the db', () => {
  test('two blogs are returned as JSON', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  }, 100000)

  test('the identifier property is named id', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body[0].id).toBeDefined()
  })
})

describe('adding a blog to the db', () => {
  test('succeeds', async () => {
    const newBlog = {
      'title': 'This is a testblog',
      'author': 'Snoopy is testing',
      'url': 'https://snoopy.com/testblog',
      'likes': 456
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    const blogsWithoutId = blogsAtEnd.map(r => {
      delete r.id
      return r
    })

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogsWithoutId).toContainEqual(newBlog)
  })

  test('with a missing likes property defaults likes to zero', async () => {
    const newBlog = {
      'title': 'This blog is missing a likes property ',
      'author': 'Snoopy is testing again',
      'url': 'https://snoopy.com/testblog2'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const lastBlogAdded = blogsAtEnd[blogsAtEnd.length-1]

    expect(lastBlogAdded.likes).toEqual(0)
  })

  test('without title or url is not allowed', async () => {
    const newBlogMissingTitle = {
      'author': 'Snoopy is missing title',
      'url': 'https://snoopy.com/testblog2',
      'likes': 123
    }

    const newBlogMissingUrl = {
      'title': 'This blog is missing an url',
      'author': 'Snoopy is missing an url',
      'likes': 123
    }

    await api
      .post('/api/blogs')
      .send(newBlogMissingTitle)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    await api
      .post('/api/blogs')
      .send(newBlogMissingUrl)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('a blog can', () => {
  test('be deleted by id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete('/api/blogs/' + blogToDelete.id)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
  })

  test('be updated by id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const newBlogContent = {
      'title': 'This is updated content',
      'author': 'Snoopy with update',
      'url': 'https://snoopy.com/update',
      'likes': 1234
    }

    await api
      .put('/api/blogs/' + blogToUpdate.id)
      .send(newBlogContent)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlogWithoudId = {
      'title': blogsAtEnd[0].title,
      'author': blogsAtEnd[0].author,
      'url': blogsAtEnd[0].url,
      'likes': blogsAtEnd[0].likes
    }

    expect(updatedBlogWithoudId).toEqual(newBlogContent)
  })
})

describe('when there is initially one user in the db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('hemlit', 10)
    const user = new User({ username: 'root', name: 'rooter', passwordHash })

    await user.save()
  })

  test('user creation succeeds with a fresh username', async () => {
    const userAtStart = await helper.usersInDb()

    const newUser = {
      username: 'new-test-user',
      name: 'Testy McTesface',
      password: 'secretsecret'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(userAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })

  describe('user creation fails if', () => {
    test('username is too short', async () => {
      const userAtStart = await helper.usersInDb()

      const newUser = {
        username: 'ne',
        name: 'Testy McTesface',
        password: 'secretsecret'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()

      expect(usersAtEnd).toHaveLength(userAtStart.length)
    })

    test('password is too short', async () => {
      const userAtStart = await helper.usersInDb()

      const newUser = {
        username: 'newuser',
        name: 'Testy McTesface',
        password: 'se'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()

      expect(usersAtEnd).toHaveLength(userAtStart.length)
    })

    test('username is missing', async () => {
      const userAtStart = await helper.usersInDb()

      const newUser = {
        name: 'Testy McTesface',
        password: 'secretsecret'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()

      expect(usersAtEnd).toHaveLength(userAtStart.length)
    })

    test('password is missing', async () => {
      const userAtStart = await helper.usersInDb()

      const newUser = {
        username: 'newuser',
        name: 'Testy McTesface'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()

      expect(usersAtEnd).toHaveLength(userAtStart.length)
    })

    test('user already exists', async () => {
      const userAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Testy McTesface',
        password: 'secretsecret'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(409)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()

      expect(usersAtEnd).toHaveLength(userAtStart.length)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})

