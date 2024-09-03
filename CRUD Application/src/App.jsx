import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {

  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({title:"", content:""});
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPostId, setcurrentPostId] = useState(null);


  // Get the Data
  useEffect(() => {
    axios.get("http://localhost:3000/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.log("Something Went Wrong"));
  }, [])

  
  // Post the new Data
  const addpost = () => {
    axios.post("http://localhost:3000/posts", newPost)
    .then((res) => {
      setPosts([...posts, res.data]);
      setNewPost({title:"", content:""})
    }).catch((err) => console.log("Something went Wrong"));
  }


  // Update request
  const updatePost = () => {
    axios.put(`http://localhost:3000/posts/${currentPostId}`, newPost)
    .then((res) => {
      setPosts(posts.map((post) => (post.id === currentPostId ? res.data : post)))
      setNewPost({title:"", content:""})
      setIsUpdating(false);
      setcurrentPostId(null);
    })
    .catch((err) => console.log("Something went Wrong"));
  }


  // Delete Post
  const deletePost = (id) => {
    axios.delete(`http://localhost:3000/posts/${id}`)
    .then(() => {
      setPosts(posts.filter((post) => post.id !== id));
    })
    .catch((err) => console.log("Something went Wrong"));
  }


  const handleSubmit = () => {
    if(isUpdating){
      updatePost();
    }else {
      addpost();
    }
  }

  // Fill Form with post data when clicking for "Update"
  const handleEditClick = (post) => {

    setNewPost({title:post.title, content:post.content});
    setIsUpdating(true);
    setcurrentPostId(post.id);
  }

  return (
    <>
      <nav className='navbar navbar-expand-lg navbar-light bg-success px-5'>
        <a href="#" className='navbar-brand'>
          <h2 className='text-white'>CRUD Post Manager</h2>
        </a>
      </nav>

      <div className='container my-4'>

        <div className='mb-5'>
          <input type="text"
            className='form-control mb-2'
            placeholder='Title' value={newPost.title} onChange={(e) => setNewPost({...newPost, title:e.target.value})}/>

          <input type="text"
            className='form-control mb-2'
            placeholder='Content' value={newPost.content} onChange={(e) => setNewPost({...newPost, content:e.target.value})}/>

          <button className='btn btn-success' onClick={handleSubmit}>
            {isUpdating ? "Update Post" : "Add Post"}
          </button>
        </div>


        <ul className='list-gruop mb-4'>

          {posts.map((post) => (

            <li key={post.id} className='list-group-item mb-4'>
              <h2>{post.title}</h2>
              <p>{post.content}</p>

              <div className='d-flex gap-3'>
                <button className='btn btn-warning' onClick={() => handleEditClick(post)} >
                  Update
                </button>

                <button className='btn btn-danger' onClick={() => deletePost(post.id)}>
                  Delete
                </button>

              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
