import { useState } from 'react'

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const createBlog = (event) => {
    event.preventDefault()

    addBlog({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <form onSubmit={createBlog}>
        <div>
          Title: <input id='title-input' value={title} onChange={handleTitleChange} />
        </div>
        <div>
          Author: <input id='author-input' value={author} onChange={handleAuthorChange} />
        </div>
        <div>
          Url: <input id='url-input' value={url} onChange={handleUrlChange} />
        </div>
        <button id='new-blog-submit' type="submit">Save</button>
      </form>
    </div>
  )}

export default BlogForm
