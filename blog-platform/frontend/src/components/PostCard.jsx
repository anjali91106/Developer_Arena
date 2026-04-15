import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleLikePost } from '../redux/slices/postsSlice';

const PostCard = ({ post }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLike = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    
    await dispatch(toggleLikePost(post._id));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <img
            src={post.author.avatar || `https://ui-avatars.com/api/?name=${post.author.username}&background=ec4899&color=fff`}
            alt={post.author.username}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <Link
              to={`/profile/${post.author._id}`}
              className="text-sm font-medium text-gray-900 hover:text-pink-600 transition-colors"
            >
              {post.author.username}
            </Link>
            <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        <Link to={`/post/${post._id}`} className="block">
          <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-pink-600 transition-colors">
            {post.title}
          </h2>
          
          <p className="text-gray-600 mb-4 line-clamp-3">
            {post.content.length > 150 
              ? `${post.content.substring(0, 150)}...` 
              : post.content
            }
          </p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-pink-100 text-pink-700 text-xs rounded-full hover:bg-pink-200 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={handleLike}
              disabled={!isAuthenticated}
              className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm transition-colors ${
                isAuthenticated
                  ? 'hover:bg-pink-50 hover:text-pink-600'
                  : 'text-gray-400 cursor-not-allowed'
              } ${
                post.isLiked ? 'text-pink-600 bg-pink-50' : 'text-gray-600'
              }`}
            >
              <svg
                className="w-5 h-5"
                fill={post.isLiked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{post.likeCount || 0}</span>
            </button>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Comments</span>
              </span>
              <span>Read more</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
