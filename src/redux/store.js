import { configureStore } from '@reduxjs/toolkit'
import viewReducer from './viewSlice'
import authReducer from './admAuthSlice'

export default configureStore({
  reducer:{
    view: viewReducer,
    auth: authReducer
  }
})