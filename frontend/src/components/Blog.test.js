import React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('url and likes are hidden by default', () => {
  const user = {
    'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkRhbiIsImlkIjoiNjUyZmZlZDBiN2NjMTAwNDhiNTg1ZWMwIiwiaWF0IjoxNjk3NzIzMzY5LCJleHAiOjE2OTc3MjY5Njl9.pjuwZlpOv77fvSo8wtgngVq9LU9CntynyAYChqUHRBM',
    'username': 'Dan',
    'name': 'Dan White'
  }
  const blog = {
    title: 'test1',
    author: 'Test Author',
    url: 'www.testing.com/test1',
    user: user
  }

  const { container } = render(<Blog blog={blog} user={user} />)

  const div = container.querySelector('.hidden-content')
  const style = getComputedStyle(div)
  expect(style.display).toBe('none')
})

test('url and likes are shown when "View" button is clicked', async () => {
  const user = {
    'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkRhbiIsImlkIjoiNjUyZmZlZDBiN2NjMTAwNDhiNTg1ZWMwIiwiaWF0IjoxNjk3NzIzMzY5LCJleHAiOjE2OTc3MjY5Njl9.pjuwZlpOv77fvSo8wtgngVq9LU9CntynyAYChqUHRBM',
    'username': 'Dan',
    'name': 'Dan White'
  }
  const blog = {
    title: 'test2',
    author: 'Test Author 2',
    url: 'www.testing.com/test2',
    user: user
  }

  const { container } = render(<Blog blog={blog} user={user} />)

  const testUser = userEvent.setup()
  const button = container.querySelector('.view')
  await testUser.click(button)

  const div = container.querySelector('.hidden-content')
  const style = getComputedStyle(div)
  expect(style.display).toBe('block')
})

/* Since I don't pass the like function, I couldn't
   figure out how to test calls. I ended up checking
   the text content that the like function calls.
   Set timeout so it would wait for text to change
*/
test('clicking the like button twice calls event handler twice', async () => {
  const user = {
    'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkRhbiIsImlkIjoiNjUyZmZlZDBiN2NjMTAwNDhiNTg1ZWMwIiwiaWF0IjoxNjk3NzIzMzY5LCJleHAiOjE2OTc3MjY5Njl9.pjuwZlpOv77fvSo8wtgngVq9LU9CntynyAYChqUHRBM',
    'username': 'Dan',
    'name': 'Dan White'
  }
  const blog = {
    title: 'test3',
    author: 'Test Author 3',
    url: 'www.testing.com/test3',
    user: user
  }

  const { container } = await render(<Blog blog={blog} user={user} />)

  const testUser = await userEvent.setup()
  const button = await container.querySelector('.like-btn')
  const likesContainer = await container.querySelector('.blog-likes')

  setTimeout(async () => {
    expect(likesContainer).toHaveTextContent('0 likes')
    await testUser.click(button)
    await testUser.click(button)
    expect(likesContainer).toHaveTextContent('2 likes')
  }, 1000)
})
