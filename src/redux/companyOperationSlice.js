import { createSlice } from '@reduxjs/toolkit'

export const slice = createSlice({
  name: 'companyOperation',
  initialState: {
    companyName: null,
    companyEmail: null,
    companyPhone: null,
    urlCompanyLogo: null,
    productsCategories: null,
    customers: null,
    currentShift: null,
    numberOfTables: null,
    companyAddress: null,
    companyLat: null,
    companyLng: null,
    orders: null,
  },
  reducers: {
    changeCompanyName(state, { payload }) { return { ...state, companyName: payload } },
    changeCompanyEmail(state, { payload }) { return { ...state, companyEmail: payload } },
    changeCompanyPhone(state, { payload }) { return { ...state, companyPhone: payload } },
    changeUrlCompanyLogo(state, { payload }) { return { ...state, urlCompanyLogo: payload } },
    changeProductsCategories(state, { payload }) { return { ...state, productsCategories: payload } },
    changeCustomers(state, { payload }) { return { ...state, customers: payload } },
    changeCurrentShift(state, { payload }) { return { ...state, currentShift: payload } },
    changeNumberOfTables(state, { payload }) { return { ...state, numberOfTables: payload } },
    changeCompanyAddress(state, { payload }) { return { ...state, companyAddress: payload } },
    changeCompanyLat(state, { payload }) { return { ...state, companyLat: payload } },
    changeCompanyLng(state, { payload }) { return { ...state, companyLng: payload } },
    changeOrders(state, { payload }) { return { ...state, orders: payload } },

    quitCompanyOperation(state) {
      state.companyName = null;
      state.companyEmail = null;
      state.companyPhone = null;
      state.urlCompanyLogo = null;
      state.productsCategories = null;
      state.customers = null;
      state.currentShift = null;
      state.numberOfTables = null;
      state.companyAddress = null;
      state.companyLat = null;
      state.companyLng = null;
      state.orders = null;
    }
  }
})

export const {
  changeCompanyName,
  changeCompanyEmail,
  changeCompanyPhone,
  changeUrlCompanyLogo,
  changeProductsCategories,
  changeCustomers,
  changeCurrentShift,
  changeNumberOfTables,
  changeCompanyAddress,
  changeCompanyLat,
  changeCompanyLng,
  changeOrders,
} = slice.actions;

export default slice.reducer