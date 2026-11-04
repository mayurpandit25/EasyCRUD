import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// Initial state
const initialState = {
  theme: 'light',
  user: null,
  notifications: [],
  isLoading: false,
  error: null,
};

// Action types
const ACTIONS = {
  SET_THEME: 'SET_THEME',
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_THEME:
      return {
        ...state,
        theme: action.payload,
      };
    case ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.payload
        ),
      };
    case ACTIONS.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      };
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const queryClient = useQueryClient();

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      dispatch({ type: ACTIONS.SET_THEME, payload: savedTheme });
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', state.theme);
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Actions
  const actions = {
    setTheme: (theme) => {
      dispatch({ type: ACTIONS.SET_THEME, payload: theme });
    },
    setUser: (user) => {
      dispatch({ type: ACTIONS.SET_USER, payload: user });
    },
    setLoading: (isLoading) => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: isLoading });
    },
    setError: (error) => {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error });
    },
    addNotification: (notification) => {
      const id = Date.now().toString();
      const newNotification = {
        id,
        timestamp: new Date(),
        ...notification,
      };
      dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: newNotification });
      
      // Auto-remove notification after 5 seconds
      setTimeout(() => {
        actions.removeNotification(id);
      }, 5000);
    },
    removeNotification: (id) => {
      dispatch({ type: ACTIONS.REMOVE_NOTIFICATION, payload: id });
    },
    clearNotifications: () => {
      dispatch({ type: ACTIONS.CLEAR_NOTIFICATIONS });
    },
    clearCache: () => {
      queryClient.clear();
    },
    invalidateQueries: (queryKey) => {
      queryClient.invalidateQueries({ queryKey });
    },
  };

  const value = {
    ...state,
    ...actions,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}; 