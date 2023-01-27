const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)

    await blogObject.save()
  }
})

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

test('a blog can be added', async () => {
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

  const response = await api.get('/api/blogs')

  const blogsWithoutId = response.body.map(r => {
    delete r.id
    return r
  })

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(blogsWithoutId).toContainEqual(newBlog)
})

afterAll(() => {
  mongoose.connection.close()
})

