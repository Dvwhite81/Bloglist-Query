import { useState } from 'react'
import Toggleable from './Toggleable'
import blogService from '../services/blogs'

const Blog = (props) => {
  const [blogLikes, setBlogLikes] = useState(props.blog.likes)

  const like = async () => {
    const likes = props.blog.likes += 1
    const likedBlog = { ...props.blog, likes }
    await blogService.update(likedBlog.id, likedBlog)
    setBlogLikes(blogLikes + 1)
    props.setNotification({
      message: `Added like to: ${likedBlog.title}!`,
      class: 'success'
    })
    props.sortBlogs()
  }

  const deleteBlog = async (blog) => {
    if (window.confirm(`Remove ${blog.title}?`)) {
      try {
        await blogService.remove(blog.id, props.user.token)
        props.setNotification({
          message: `Successfully removed ${blog.title}!`,
          class: 'success'
        })
        props.sortBlogs()
        props.removeBlog(blog)
      } catch(error) {
        props.setNotification({
          message: error.message,
          class: 'error'
        })
      }
    }
  }

  return (
    <div className='single-blog'>
      <div className='word-wrap'>
        <strong>{props.blog.title}</strong> by <em>{props.blog.author}</em>
      </div>
      <Toggleable
        type={'null'}
        divClass={'blog-view-container'}
        containerDisplay={props.containerDisplay}
        setContainerDisplay={props.setContainerDisplay}
        buttonClass={'toggle-blog-view-button'}
        buttonLabel="View"
      >
        <div className='blog-details'>
          <div className='word-wrap'>{props.blog.url}</div>
          <div className='likes-container'>
            <div className='blog-likes'>{blogLikes} likes</div>
            <button className='like-btn' onClick={like}>Like</button>
          </div>
          <div>{props.blog.user.name || props.user.name}</div>
          {props.user.name === props.blog.user.name ?
            <button className='delete-blog' onClick={() => deleteBlog(props.blog)}>Remove</button>
            : null}
        </div>
      </Toggleable>
    </div>
  )
}

export default Blog
