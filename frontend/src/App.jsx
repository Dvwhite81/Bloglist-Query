import { useState, useEffect, useRef } from 'react'
import AllBlogs from './components/AllBlogs'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Toggleable from './components/Toggleable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [containerDisplay, setContainerDisplay] = useState('one-column')

  useEffect(() => {
    const fetchData = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setContainerDisplay('one-column')
      setSuccessMessage(`Logged in ${username}!`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const blogFormRef = useRef()

  const addBlog = async (blog) => {
    try {
      blogFormRef.current.toggleVisibility()
      const newBlog = await blogService.create(blog)
      newBlog.user = user
      setBlogs(blogs.concat(newBlog))
      setSuccessMessage(`Added your blog: ${blog.title}!`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch (exception) {
      setErrorMessage('There was a problem adding your blog. Try logging out and back in')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  return (
    <div className="main-container">
      <h2>Blog App</h2>
      <Notification message={successMessage} type="success" />
      <Notification message={errorMessage} type="error" />
      {user === null ? (
        <div className="logged-out-container">
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
          />
        </div>
      ) : (
        <div className={`logged-in-container ${containerDisplay}`}>
          <div className="user-logged-in">
            {user.username} logged in
            <button onClick={handleLogout}>Log Out</button>
          </div>
          <Toggleable
            type={'display'}
            divClass={'blog-form-container'}
            containerDisplay={containerDisplay}
            setContainerDisplay={setContainerDisplay}
            buttonClass={'toggle-display-button'}
            buttonLabel="New Blog"
            buttonId="new-blog-btn"
            ref={blogFormRef}
          >
            <BlogForm addBlog={addBlog} />
          </Toggleable>
          <div className="blogs-container">
            <AllBlogs blogs={blogs} user={user} setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
