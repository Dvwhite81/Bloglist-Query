import { useState, useEffect, useRef, useReducer, useContext } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AllBlogs from './components/AllBlogs'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Toggleable from './components/Toggleable'
import blogService from './services/blogs'
import loginService from './services/login'
import { useNotifications } from './NotificationContext'
import { getBlogs, createBlog, updateBlog } from './requests'

const App = () => {
  const queryClient = useQueryClient()

  const [blogs, setBlogs] = useState([])
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

  const { setNotification } = useNotifications()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs,
    refetchOnWindowFocus: false
  })

  if (!result.isSuccess) {
    console.log('loading')
  }

  const allBlogs = result.data

  const newBlogMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: (newBlog) => {
      queryClient.setQueryData(['blogs'], previous => [...previous, newBlog])
      setNotification({
        message: `Added your blog: ${blog.title}!`,
        class: 'success'
      })
    },
    onError: error => {
      setNotification({
        message: error.message,
        class: 'error'
      })
    }
  })

  const addBlog = async (blog) => {
    blogFormRef.current.toggleVisibility()
    newBlogMutation.mutate(blog)
  }

  const updateBlogMutation = useMutation({
    mutationFn: updateBlog,
    onSuccess: (updatedBlog) => {
      const allBlogs = queryClient.getQueryData(
        ['blogs'],
        allBlogs.map((blog) =>
          blog.id !== updatedBlog.id ? blog : updatedBlog
        )
      )
      queryClient.invalidateQueries('blogs')
    }
  })

  const addLike = (blog) => {
    updateBlogMutation.mutate({ ...blog, likes: blog.likes + 1 })
  }

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
      setNotification({
        message: `Logged in ${username}!`,
        class: 'success'
      })
    } catch (exception) {
      setNotification({
        message: 'Wrong credentials',
        class: 'error'
      })
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogAppUser')
    setNotification({
      message: `Logged out ${username}`,
      class: 'success'
    })
    setUser(null)
  }

  const blogFormRef = useRef()

  return (
    <div className="main-container">
      <h2>Blog App</h2>
      <Notification />
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
            <AllBlogs blogs={blogs} user={user} setNotification={setNotification} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
