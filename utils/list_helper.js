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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}