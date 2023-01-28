const Blog = require('../models/blog')

const initialBlogs = [
  {
    'title': 'This is testblog number one',
    'author': 'Snoopy the tester',
    'url': 'https://snoopy.com/blog1',
    'likes': 306
  },
  {
    'title': 'This is testblog number two',
    'author': 'Charlie the tester',
    'url': 'https://snoopy.com/blog2',
    'likes': 123
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb
}