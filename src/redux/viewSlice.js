import { createSlice } from '@reduxjs/toolkit'

export const slice = createSlice({
  name: 'view',
  initialState: {
    windowWidth: window.innerWidth,
    windowsAvailableWithoutMenu: window.innerWidth - 240,
    isDesktopView: '',
    theme: localStorage.getItem('theme') || 'DARK',
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
    },
    setTheme(state, { payload }) {
      localStorage.setItem('theme', payload);
      return {...state, theme: payload}
    }
  }
})

export const { setWindowWidth, setWindowsAvailableWithoutMenu, changeView, setTheme } = slice.actions

export default slice.reducer