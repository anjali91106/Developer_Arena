import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile, getUserPosts } from '../redux/slices/postsSlice';
import BackButton from '../components/BackButton';

const Profile = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  
  const { loading } = useSelector((state) => state.posts);
  const [profileData, setProfileData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileResponse = await dispatch(getUserProfile(userId)).unwrap();
        setProfileData(profileResponse);
        
        // Fetch user-specific posts
        const postsResponse = await dispatch(getUserPosts({ userId, page: 1 })).unwrap();
        setUserPosts(postsResponse.posts || postsResponse);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    
    fetchProfileData();
  }, [dispatch, userId]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <BackButton />
          </div>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-6">
            <img
              src={profileData?.user.avatar || `https://ui-avatars.com/api/?name=${profileData?.user.username}&background=ec4899&color=fff`}
              alt={profileData?.user.username}
              className="w-24 h-24 rounded-full"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profileData?.user.username}
              </h1>
              <p className="text-gray-600 mb-4">
                {profileData?.user.bio || 'No bio yet.'}
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span>
                  <strong className="text-gray-900">{userPosts.length || 0}</strong> posts
                </span>
                <span>
                  Joined {profileData?.user.createdAt && formatDate(profileData.user.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User's Posts */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Posts by {profileData?.user.username}
          </h2>
          
          {userPosts.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No posts yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                {profileData?.user.username} hasn't published any posts yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {userPosts.map((post) => (
                <div key={post._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-pink-600 cursor-pointer">
                    <a href={`/post/${post._id}`}>{post.title}</a>
                  </h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {post.content.length > 150 
                      ? `${post.content.substring(0, 150)}...` 
                      : post.content
                    }
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{formatDate(post.createdAt)}</span>
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{post.likeCount || 0}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>Comments</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
