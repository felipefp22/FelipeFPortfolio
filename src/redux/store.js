import { configureStore } from '@reduxjs/toolkit'
import viewReducer from './viewSlice'
import authReducer from './admAuthSlice'
import companyOperationReducer from './companyOperationSlice'


export default configureStore({
  reducer:{
    view: viewReducer,
    auth: authReducer,
    companyOperation: companyOperationReducer
  }
})