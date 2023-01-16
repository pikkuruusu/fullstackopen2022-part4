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

module.exports = {
  initialBlogs
}