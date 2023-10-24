import axios from 'axios'
const blogUrl = '/api/blogs'
const loginUrl = '/api/login'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

export const getBlogs = async () => {
  const response = await axios.get(blogUrl)
  return response.data
}

export const createBlog = async (newObject) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(blogUrl, newObject, config)
  return response.data
}

export const updateBlog = async (newObject) => {
  const response = await axios.put(`${blogUrl}/${newObject.id}`, newObject)
  return response.data
}
