import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AllPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center">Loading posts...</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">All User Posts</h1>
      {posts.map(post => (
        <div key={post._id} className="bg-white dark:bg-dark-700 p-4 rounded shadow">
          <div className="flex items-center gap-2">
            <img
              src={post.user?.avatar || '/default-avatar.png'}
              alt={post.user?.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="font-semibold">{post.user?.name}</span>
            <span className="text-sm text-gray-500 ml-auto">{new Date(post.createdAt).toLocaleString()}</span>
          </div>
          <h2 className="text-xl mt-2 font-semibold">{post.title}</h2>
          <p className="text-gray-700 dark:text-gray-300">{post.content}</p>
          <Link
            to={`/post/${post._id}`}
            className="text-blue-600 hover:underline block mt-2"
          >
            View Post
          </Link>
        </div>
      ))}
    </div>
  );
};

export default AllPostsPage;
