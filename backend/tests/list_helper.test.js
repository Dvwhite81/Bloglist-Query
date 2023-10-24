const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('when list is empty, equals zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listHelper.listWithOneBlog)
    expect(result).toBe(5)
  })

  test('when list is larger, equals appropriate number of likes', () => {
    const result = listHelper.totalLikes(listHelper.initialBlogs)
    expect(result).toBe(36)
  })
})

describe('favorite blog', () => {
  test('when list is empty, returns null', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toEqual(null)
  })

  test('when list has only one blog, returns that blog', () => {
    const result = listHelper.favoriteBlog(listHelper.listWithOneBlog)
    expect(result).toEqual({
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  test('when list is larger, returns appropriate blog', () => {
    const result = listHelper.favoriteBlog(listHelper.initialBlogs)
    expect(result).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    })
  })
})

describe('most blogs', () => {
  test('when list is empty, returns null', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toEqual(null)
  })

  test('when list has only one blog, returns that author and one blog', () => {
    const result = listHelper.mostBlogs(listHelper.listWithOneBlog)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 1
    })
  })

  test('when list is larger, returns appropriate author and number of blogs', () => {
    const result = listHelper.mostBlogs(listHelper.initialBlogs)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})

describe('most likes', () => {
  test('when list is empty, returns null', () => {
    const result = listHelper.mostLikes([])
    expect(result).toEqual(null)
  })

  test('when list has only one blog, returns that blog author and likes', () => {
    const result = listHelper.mostLikes(listHelper.listWithOneBlog)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  test('when list is larger, returns appropriate author and number of likes', () => {
    const result = listHelper.mostLikes(listHelper.initialBlogs)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
})
