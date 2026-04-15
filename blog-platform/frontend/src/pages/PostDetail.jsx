import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostById, toggleLikePost, deletePost } from '../redux/slices/postsSlice';
import { fetchCommentsByPost, addComment } from '../redux/slices/commentsSlice';
import Comment from '../components/Comment';
import BackButton from '../components/BackButton';

const PostDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentPost, loading: postLoading } = useSelector((state) => state.posts);
  const { comments, loading: commentsLoading } = useSelector((state) => state.comments);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyUsername, setReplyUsername] = useState('');

  useEffect(() => {
    dispatch(fetchPostById(id));
    dispatch(fetchCommentsByPost({ postId: id, page: 1 }));
  }, [dispatch, id]);

  const handleLike = async () => {
    if (!isAuthenticated) return;
    await dispatch(toggleLikePost(id));
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await dispatch(deletePost(id)).unwrap();
        navigate('/');
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await dispatch(addComment({
        postId: id,
        content: newComment.trim(),
        parentComment: replyTo
      })).unwrap();
      
      setNewComment('');
      setReplyTo(null);
      setReplyUsername('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleReply = (commentId, username) => {
    setReplyTo(commentId);
    setReplyUsername(username);
    setNewComment(`@${username} `);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (postLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h2>
          <Link
            to="/"
            className="bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Post Details</h1>
            <BackButton />
          </div>
        </div>

        {/* Post Content */}
        <article className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <header className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img
                  src={currentPost.author.avatar || `https://ui-avatars.com/api/?name=${currentPost.author.username}&background=ec4899&color=fff`}
                  alt={currentPost.author.username}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <Link
                    to={`/profile/${currentPost.author._id}`}
                    className="text-lg font-medium text-gray-900 hover:text-pink-600 transition-colors"
                  >
                    {currentPost.author.username}
                  </Link>
                  <p className="text-sm text-gray-500">{formatDate(currentPost.createdAt)}</p>
                </div>
              </div>
              
              {isAuthenticated && currentPost.author._id === user?.id && (
                <div className="flex items-center space-x-3">
                  <Link
                    to={`/edit-post/${currentPost._id}`}
                    className="text-pink-600 hover:text-pink-500 font-medium"
                  >
                    Edit Post
                  </Link>
                  <button
                    onClick={handleDeletePost}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Delete Post
                  </button>
                </div>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {currentPost.title}
            </h1>

            {currentPost.tags && currentPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {currentPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-pink-100 text-pink-700 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="prose prose-lg max-w-none mb-8">
            <div className="whitespace-pre-wrap text-gray-700">
              {currentPost.content}
            </div>
          </div>

          <footer className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={handleLike}
              disabled={!isAuthenticated}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                isAuthenticated
                  ? 'hover:bg-pink-50'
                  : 'text-gray-400 cursor-not-allowed'
              } ${
                currentPost.isLiked ? 'text-pink-600 bg-pink-50' : 'text-gray-600'
              }`}
            >
              <svg
                className="w-5 h-5"
                fill={currentPost.isLiked ? 'currentColor' : 'none'}
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
              <span>{currentPost.likeCount || 0} {currentPost.likeCount === 1 ? 'Like' : 'Likes'}</span>
            </button>

            <div className="text-sm text-gray-500">
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </div>
          </footer>
        </article>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>

          {/* Add Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="mb-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={replyTo ? `Replying to ${replyUsername}...` : "Share your thoughts..."}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-none"
                  rows={4}
                />
              </div>
              
              {replyTo && (
                <div className="mb-4 flex items-center justify-between bg-pink-50 p-3 rounded-lg">
                  <span className="text-sm text-pink-700">
                    Replying to {replyUsername}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setReplyTo(null);
                      setReplyUsername('');
                      setNewComment('');
                    }}
                    className="text-pink-600 hover:text-pink-700 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={!newComment.trim()}
                className="bg-gradient-to-r from-pink-500 to-purple-400 text-white px-6 py-2 rounded-md font-medium hover:from-pink-600 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post Comment
              </button>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600 mb-2">
                Please <Link to="/login" className="text-pink-600 hover:text-pink-500 font-medium">log in</Link> to leave a comment.
              </p>
            </div>
          )}

          {/* Comments List */}
          {commentsLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No comments yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Be the first to share your thoughts on this post.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  onReply={handleReply}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
