import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import commentService from '../../services/commentService';

// Async thunks
export const fetchCommentsByPost = createAsyncThunk(
  'comments/fetchCommentsByPost',
  async ({ postId, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await commentService.getCommentsByPost(postId, { page });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ postId, content, parentComment }, { rejectWithValue }) => {
    try {
      const response = await commentService.addComment(postId, { content, parentComment });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const response = await commentService.updateComment(commentId, { content });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commentId, { rejectWithValue }) => {
    try {
      await commentService.deleteComment(commentId);
      return commentId;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  comments: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalComments: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  loading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearComments: (state) => {
      state.comments = [];
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalComments: 0,
        hasNextPage: false,
        hasPrevPage: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchCommentsByPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommentsByPost.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.comments;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCommentsByPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add comment
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        const newComment = action.payload.comment;
        
        // If it's a reply to a comment, find and update the parent comment
        if (newComment.parentComment) {
          const parentComment = state.comments.find(comment => comment._id === newComment.parentComment);
          if (parentComment) {
            if (!parentComment.replies) {
              parentComment.replies = [];
            }
            parentComment.replies.push(newComment);
          }
        } else {
          // It's a top-level comment, add to the beginning
          state.comments.unshift(newComment);
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update comment
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false;
        const updatedComment = action.payload.comment;
        
        // Update comment in the main comments array
        const commentIndex = state.comments.findIndex(comment => comment._id === updatedComment._id);
        if (commentIndex !== -1) {
          state.comments[commentIndex] = updatedComment;
        }
        
        // Also check in replies
        state.comments.forEach(comment => {
          if (comment.replies) {
            const replyIndex = comment.replies.findIndex(reply => reply._id === updatedComment._id);
            if (replyIndex !== -1) {
              comment.replies[replyIndex] = updatedComment;
            }
          }
        });
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete comment
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        const deletedCommentId = action.payload;
        
        // Remove from main comments
        state.comments = state.comments.filter(comment => comment._id !== deletedCommentId);
        
        // Remove from replies
        state.comments.forEach(comment => {
          if (comment.replies) {
            comment.replies = comment.replies.filter(reply => reply._id !== deletedCommentId);
          }
        });
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearComments } = commentsSlice.actions;
export default commentsSlice.reducer;
