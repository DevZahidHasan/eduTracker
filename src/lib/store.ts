import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import configReducer from './features/configSlice';
import studentsReducer from './features/studentsSlice';
import marksReducer from './features/marksSlice';
import attendanceReducer from './features/attendanceSlice';
import aiInsightsReducer from './features/aiInsightsSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      config: configReducer,
      students: studentsReducer,
      marks: marksReducer,
      attendance: attendanceReducer,
      aiInsights: aiInsightsReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
