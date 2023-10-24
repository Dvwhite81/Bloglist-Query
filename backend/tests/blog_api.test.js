const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

describe('when there are some initial blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all initial blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(b => b.title)
    expect(titles).toContain(
      'React patterns'
    )
  })

  test('the unique identifier of each blog is id', async () => {
    const blogs = await Blog.find({})

    expect(blogs[0].id).toBeDefined()
  })
})

describe('when adding a blog', () => {
  let validation

  beforeEach(async () => {
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)

    const result = api
      .post('/api/login')
      .send(newUser)

    validation = {
      'Authorization': `Bearer ${(await result).body.token}`
    }
  })
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'test blog number one',
      author: 'Test Author',
      url: 'http://www.testing.com/test-blog',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .set(validation)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain(
      'test blog number one'
    )
  })

  test('if likes property is not given, likes defaults to zero', async () => {
    const noLikesBlog = {
      title: 'test blog number two',
      author: 'Test Author Two',
      url: 'http://www.testing.com/test-blog-two'
    }

    await api
      .post('/api/blogs')
      .send(noLikesBlog)
      .expect(201)
      .set(validation)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const addedBlog = await blogsAtEnd.find(blog => blog.title === 'test blog number two')
    expect(addedBlog.likes).toBe(0)
  })

  test('if title or url is missing, blog will not be added', async () => {
    const noTitleBlog = {
      author: 'Test Author Three',
      url: 'http://www.testing.com/test-blog-three',
      likes: 4
    }

    const noUrlBlog = {
      title: 'test blog number four',
      author: 'Test Author Four',
      likes: 7
    }

    await api
      .post('/api/blogs')
      .send(noTitleBlog)
      .expect(400)
      .set(validation)

    await api
      .post('/api/blogs')
      .send(noUrlBlog)
      .expect(400)
      .set(validation)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('when deleting a blog', () => {
  let validation

  beforeEach(async () => {
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)

    const result = api
      .post('/api/login')
      .send(newUser)

    validation = {
      'Authorization': `Bearer ${(await result).body.token}`
    }
  })

  test('succeeds with status code 204 if id is valid', async () => {
    const newBlog = {
      title: 'This blog will be deleted',
      author: 'Delete Author',
      url: 'http://www.delete-blog.com',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .set(validation)

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart.find(blog => blog.title === newBlog.title)

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
      .set(validation)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('when updating a blog', () => {
  test('blog is successfully changed', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const updatedBlog = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 1
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const blogWithUpdatedLikes = blogsAtEnd.find(blog => blog.title === blogToUpdate.title)
    expect(blogWithUpdatedLikes.likes).toBe(blogToUpdate.likes + 1)
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username or password is less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const shortNameUser = {
      username: 'ab',
      name: 'Name Too Short',
      password: 'password',
    }

    const shortPasswordUser = {
      username: 'abcdefg',
      name: 'Password Too Short',
      password: 'ab'
    }

    const result = await api
      .post('/api/users')
      .send(shortNameUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('User validation failed: username: Path `username` (`ab`) is shorter than the minimum allowed length (3)')

    const result2 = await api
      .post('/api/users')
      .send(shortPasswordUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result2.body.error).toContain('User validation failed: password: Path `password` (`ab`) is shorter than the minimum allowed length (3).')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
