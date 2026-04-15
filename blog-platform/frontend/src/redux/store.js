import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import postsSlice from './slices/postsSlice';
import commentsSlice from './slices/commentsSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    posts: postsSlice,
    comments: commentsSlice,
    ui: uiSlice,
  },
});
