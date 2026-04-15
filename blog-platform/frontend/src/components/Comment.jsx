import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateComment, deleteComment } from '../redux/slices/commentsSlice';

const Comment = ({ comment, onReply, isReply = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const isAuthor = user?.id === comment.author._id;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEdit = async () => {
    try {
      await dispatch(updateComment({ commentId: comment._id, content: editContent })).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await dispatch(deleteComment(comment._id)).unwrap();
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    }
  };

  const handleReply = () => {
    if (onReply) {
      onReply(comment._id, comment.author.username);
    }
  };

  return (
    <div className={`${isReply ? 'ml-8 mt-3' : 'mb-4'} bg-white rounded-lg p-4 border border-gray-200`}>
      <div className="flex items-start space-x-3">
        <img
          src={comment.author.avatar || `https://ui-avatars.com/api/?name=${comment.author.username}&background=ec4899&color=fff`}
          alt={comment.author.username}
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div>
              <span className="font-medium text-gray-900 text-sm">
                {comment.author.username}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                {formatDate(comment.createdAt)}
              </span>
            </div>
            
            {isAuthor && (
              <div className="flex items-center space-x-2">
                {!isEditing && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs text-gray-500 hover:text-pink-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="text-xs text-gray-500 hover:text-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-pink-500 focus:border-pink-500 resize-none"
                rows={3}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleEdit}
                  className="px-3 py-1 bg-pink-500 text-white text-xs rounded-md hover:bg-pink-600 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                  className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 text-sm whitespace-pre-wrap">
              {comment.content}
            </p>
          )}

          {!isEditing && (
            <div className="mt-2 flex items-center space-x-4">
              {isAuthenticated && (
                <button
                  onClick={handleReply}
                  className="text-xs text-gray-500 hover:text-pink-600 transition-colors"
                >
                  Reply
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-3">
          {comment.replies.map((reply) => (
            <Comment
              key={reply._id}
              comment={reply}
              onReply={onReply}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
