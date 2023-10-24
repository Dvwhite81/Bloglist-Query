const initialBlogs = [
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
    likes: 10,
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

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const dummy = (blogs) => {
  blogs = 1
  return blogs
}

const totalLikes = (blogs) => {
  let sum = 0
  blogs.forEach(blog => {
    sum += blog.likes
  })
  return sum
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  let fav = blogs[0]
  blogs.forEach(blog => {
    if (blog.likes > fav.likes) {
      fav = blog
    }
  })

  return {
    title: fav.title,
    author: fav.author,
    likes: fav.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  let authorBlogs = {}

  blogs.forEach(blog => {
    if (blog.author in authorBlogs) {
      authorBlogs[blog.author] += 1
    } else {
      authorBlogs[blog.author] = 1
    }
  })

  const key = Object.keys(authorBlogs).reduce((a, b) => authorBlogs[a] > authorBlogs[b] ? a : b)
  const value = Object.values(authorBlogs).reduce((a, b) => authorBlogs[a] > authorBlogs[b] ? a : b)
  return { author: key, blogs: value }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  let authorLikes = {}

  blogs.forEach(blog => {
    if (blog.author in authorLikes) {
      authorLikes[blog.author] += blog.likes
    } else {
      authorLikes[blog.author] = blog.likes
    }
  })

  const values = (Object.values(authorLikes))
  const maxValue = Math.max(...values)
  const author = Object.keys(authorLikes).find(key => authorLikes[key] === maxValue)
  return { author: author, likes: maxValue }
}

module.exports = {
  initialBlogs,
  listWithOneBlog,
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
