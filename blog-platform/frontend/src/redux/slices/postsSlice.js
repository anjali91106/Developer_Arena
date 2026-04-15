import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import postService from '../../services/postService';

// Async thunks
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await postService.getAllPosts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await postService.getPostById(postId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await postService.createPost(postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ postId, postData }, { rejectWithValue }) => {
    try {
      const response = await postService.updatePost(postId, postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId, { rejectWithValue }) => {
    try {
      await postService.deletePost(postId);
      return postId;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const toggleLikePost = createAsyncThunk(
  'posts/toggleLikePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await postService.toggleLike(postId);
      return { postId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const searchPosts = createAsyncThunk(
  'posts/searchPosts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await postService.searchPosts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getUserProfile = createAsyncThunk(
  'posts/getUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await postService.getUserProfile(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getUserPosts = createAsyncThunk(
  'posts/getUserPosts',
  async ({ userId, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await postService.getUserPosts(userId, { page });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'posts/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await postService.updateProfile(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  posts: [],
  currentPost: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  loading: false,
  error: null,
  searchResults: [],
  searchLoading: false,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch post by ID
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload.post;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload.post);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update post
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.posts.findIndex(post => post._id === action.payload.post._id);
        if (index !== -1) {
          state.posts[index] = action.payload.post;
        }
        if (state.currentPost && state.currentPost._id === action.payload.post._id) {
          state.currentPost = action.payload.post;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete post
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter(post => post._id !== action.payload);
        if (state.currentPost && state.currentPost._id === action.payload) {
          state.currentPost = null;
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle like
      .addCase(toggleLikePost.fulfilled, (state, action) => {
        const { postId, likeCount, isLiked } = action.payload;
        const postIndex = state.posts.findIndex(post => post._id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].likeCount = likeCount;
          state.posts[postIndex].isLiked = isLiked;
        }
        if (state.currentPost && state.currentPost._id === postId) {
          state.currentPost.likeCount = likeCount;
          state.currentPost.isLiked = isLiked;
        }
      })
      // Search posts
      .addCase(searchPosts.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.posts;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentPost, clearSearchResults } = postsSlice.actions;
export default postsSlice.reducer;
