import { useEffect, useState } from 'react'
import Blog from './Blog'

const AllBlogs = ({ blogs, user, setNotification }) => {
  const [blogsToShow, setBlogsToShow] = useState([])

  const sortBlogs = async () => {
    const sorted = [...blogs].sort((a, b) => b.likes - a.likes)
    setBlogsToShow(sorted)
  }

  const removeBlog = (blog) => {
    const index = blogsToShow.indexOf(blog)
    blogsToShow.splice(index, 1)
    setBlogsToShow([...blogsToShow])
  }

  useEffect(() => {
    const sortBlogs = () => {
      const sorted = [...blogs].sort((a, b) => b.likes - a.likes)
      setBlogsToShow(sorted)
    }
    sortBlogs()
  }, [blogs])

  return (
    <>
      {blogsToShow.map((blog) => (
        <Blog key={blog.id} blog={blog} user={user} blogs={blogsToShow} sortBlogs={sortBlogs} removeBlog={removeBlog} setNotification={setNotification} />
      ))}
    </>
  )
}

export default AllBlogs
