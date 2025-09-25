import { createSlice } from '@reduxjs/toolkit'

export const slice = createSlice({
  name: 'auth',
  initialState: {
    isAdmAuthenticated: false,
    isAdmMasterAuthenticated: false,
    urlProfilePhoto: null,
    categories: [],
  },
  reducers: {
    setIsAdmAuthenticated(state, { payload }) {
      return { ...state, isAdmAuthenticated: payload }
    },
    setIsAdmMasterAuthenticated(state, { payload }) {
      return { ...state, isAdmMasterAuthenticated: payload }
    },

    logOut(state) {
      state.isAdmAuthenticated = false;
      state.isAdmMasterAuthenticated = false;
    }

  }
})

export const { setIsAdmAuthenticated, setIsAdmMasterAuthenticated, logOut } = slice.actions

export default slice.reducer