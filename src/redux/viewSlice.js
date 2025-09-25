import { createSlice } from '@reduxjs/toolkit'

export const slice = createSlice({
  name: 'view',
  initialState: {
    windowWidth: window.innerWidth,
    windowsAvailableWithoutMenu: window.innerWidth - 240,
    isDesktopView: '',
  },
  reducers: {
    setWindowWidth(state, { payload }) {
      return {...state, windowWidth: payload}
    },
    setWindowsAvailableWithoutMenu(state, { payload }) {
      return {...state, windowsAvailableWithoutMenu: payload}
    },
    changeView(state, { payload }) {
      return {...state, isDesktopView: payload}
    }
  }
})

export const { setWindowWidth, setWindowsAvailableWithoutMenu, changeView } = slice.actions

export default slice.reducer