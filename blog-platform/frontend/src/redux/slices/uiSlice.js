import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toasts: [],
    loading: false,
    sidebarOpen: false,
  },
  reducers: {
    addToast: (state, action) => {
      const { message, type = 'info', duration = 5000 } = action.payload;
      const toast = {
        id: Date.now(),
        message,
        type,
        duration,
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { addToast, removeToast, clearToasts, setLoading, toggleSidebar, setSidebarOpen } = uiSlice.actions;

// Auto-remove toast after duration
export const addToastWithAutoRemove = (toast) => (dispatch) => {
  dispatch(addToast(toast));
  
  if (toast.duration !== 0) {
    setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, toast.duration || 5000);
  }
};

export default uiSlice.reducer;
