const _ = require('lodash')

const dummy = (blogs) => {
  return blogs ? 1 : 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (previous, current) => {
    return (previous.likes >= current.likes) ? previous : current
  }

  const formatBlogObject = ({ title, author, likes }) => ({ title, author, likes })

  return blogs.length ? formatBlogObject(blogs.reduce(reducer)) : {}
}

const mostBlogs = (blogs) => {
  const authorCount =
    _(blogs).groupBy('author')
      .map((value, key) => {
        return ({
          author: key,
          blogs: value.length
        })
      })
      .value()

  return blogs.length ? _.maxBy(authorCount, 'blogs') : {}
}

const mostLikes = (blogs) => {
  const authorLikesSum =
    _(blogs).groupBy('author')
      .map((value, key) => {
        return ({
          author: key,
          likes: _.sumBy(value, 'likes')
        })
      })
      .value()

  return blogs.length ? _.maxBy(authorLikesSum, 'likes') : {}
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}