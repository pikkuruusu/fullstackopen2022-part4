const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

const listWithZeroBlogs = []
const listWithOneBlog = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  }
]

const listWithMultipleBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

describe('total likes', () => {
  test('of empty list is 0', () => {
    expect(listHelper.totalLikes(listWithZeroBlogs)).toBe(0)
  })

  test('when test only has one blog equals the likes of that', () => {
    expect(listHelper.totalLikes(listWithOneBlog)).toBe(7)
  })

  test('of a bigger list is calculated right', () => {
    expect(listHelper.totalLikes(listWithMultipleBlogs)).toBe(38)
  })
})

describe('favorite blog', () => {
  test('of empty list is empty object', () => {
    expect(listHelper.favoriteBlog(listWithZeroBlogs)).toStrictEqual({})
  })

  test('when test only has one blog returns that', () => {
    expect(listHelper.favoriteBlog(listWithOneBlog)).toEqual({
      title: 'React patterns',
      author: 'Michael Chan',
      likes: 7
    })
  })

  test('of a bigger list return first blog with most likes', () => {
    expect(listHelper.favoriteBlog(listWithMultipleBlogs)).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    })
  })
})

describe('most blogs', () => {
  test('of empty list is empty object', () => {
    expect(listHelper.mostBlogs(listWithZeroBlogs)).toStrictEqual({})
  })

  test('when list only has one blog returns that author', () => {
    expect(listHelper.mostBlogs(listWithOneBlog)).toEqual({
      author: 'Michael Chan',
      blogs: 1
    })
  })

  test('of a bigger list returns first author with most blogs', () => {
    expect(listHelper.mostBlogs(listWithMultipleBlogs)).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})

describe('most likes',() => {
  test('of empty list is empty object', () => {
    expect(listHelper.mostLikes(listWithZeroBlogs)).toStrictEqual({})
  })

  test('when list only has one blog returns that author', () => {
    expect(listHelper.mostLikes(listWithOneBlog)).toEqual({
      author: 'Michael Chan',
      likes: 7
    })
  })
  test('of a bigger list returns first author with most likes', () => {
    expect(listHelper.mostLikes(listWithMultipleBlogs)).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
})