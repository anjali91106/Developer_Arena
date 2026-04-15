import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPosts, searchPosts } from '../redux/slices/postsSlice';
import PostCard from '../components/PostCard';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const dispatch = useDispatch();
  const { posts, loading, error, pagination, searchResults, searchLoading } = useSelector(
    (state) => state.posts
  );

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      dispatch(searchPosts({ q: searchQuery, page: 1 }));
    } else {
      setIsSearching(false);
      dispatch(fetchPosts());
    }
  };

  const handleLoadMore = () => {
    const nextPage = pagination.currentPage + 1;
    if (isSearching) {
      dispatch(searchPosts({ q: searchQuery, page: nextPage }));
    } else {
      dispatch(fetchPosts({ page: nextPage }));
    }
  };

  const displayPosts = isSearching ? searchResults : posts;

  // Debug logging to check if posts are loaded
  console.log('Posts state:', posts);
  console.log('Loading state:', loading);
  console.log('Display posts:', displayPosts);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-400 to-purple-400 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to BlogSpace
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Discover amazing stories and share your own with our community
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex bg-white rounded-lg shadow-lg overflow-hidden">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for posts, topics, or authors..."
                className="flex-1 px-6 py-4 text-gray-700 placeholder-gray-500 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 font-medium hover:from-pink-600 hover:to-purple-600 transition-all"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Posts Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isSearching ? 'Search Results' : 'Latest Posts'}
          </h2>
          {isSearching && (
            <p className="text-gray-600">
              Showing results for "{searchQuery}"
            </p>
          )}
        </div>

        {loading || searchLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-300 rounded w-full mb-3"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-300 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-4">
              {error}
            </div>
            <button
              onClick={() => dispatch(fetchPosts())}
              className="bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : displayPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {isSearching ? 'No posts found matching your search.' : 'No posts available yet.'}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Load More Button */}
            {pagination.hasNextPage && (
              <div className="text-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-md font-medium hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More Posts'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
