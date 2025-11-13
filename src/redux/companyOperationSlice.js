import { createSlice } from '@reduxjs/toolkit'

export const slice = createSlice({
  name: 'companyOperation',
  initialState: {
    companyOperationID: null,
    ownerID: null,
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
    employees: null,
    taxServicePercentage: null,
    deliveryHasServiceTax: null,
    pickupHasServiceTax: null,
    maxRecommendedDistanceKM: null,
    maxDeliveryDistanceKM: null,
    baseDeliveryDistanceKM: null,
    baseDeliveryTax: null,
    taxPerExtraKM: null,
  },
  reducers: {
    changeCompanyOperationID(state, { payload }) { return { ...state, companyOperationID: payload } },
    changeOwnerID(state, { payload }) { return { ...state, ownerID: payload } },
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
    changeEmployees(state, { payload }) { return { ...state, employees: payload } },
    changeTaxServicePercentage(state, { payload }) { return { ...state, taxServicePercentage: payload } },
    changeDeliveryHasServiceTax(state, { payload }) { return { ...state, deliveryHasServiceTax: payload } },
    changePickupHasServiceTax(state, { payload }) { return { ...state, pickupHasServiceTax: payload } },
    changeMaxRecommendedDistanceKM(state, { payload }) { return { ...state, maxRecommendedDistanceKM: payload } },
    changeMaxDeliveryDistanceKM(state, { payload }) { return { ...state, maxDeliveryDistanceKM: payload } },
    changeBaseDeliveryDistanceKM(state, { payload }) { return { ...state, baseDeliveryDistanceKM: payload } },
    changeBaseDeliveryTax(state, { payload }) { return { ...state, baseDeliveryTax: payload } },
    changeTaxPerExtraKM(state, { payload }) { return { ...state, taxPerExtraKM: payload } },

    quitCompanyOperation(state) {
      localStorage.removeItem('companyOperatingID');

      state.companyOperationID = null;
      state.ownerID = null;
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
      state.employees = null;
      state.ownerID = null;
      state.taxServicePercentage = null;
      state.deliveryHasServiceTax = null;
      state.pickupHasServiceTax = null;
      state.maxRecommendedDistanceKM = null;
      state.maxDeliveryDistanceKM = null;
      state.baseDeliveryDistanceKM = null;
      state.baseDeliveryTax = null;
      state.taxPerExtraKM = null;
    }
  }
})

export const {
  changeCompanyOperationID,
  changeOwnerID,
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
  changeEmployees,
  changeTaxServicePercentage,
  changeDeliveryHasServiceTax,
  changePickupHasServiceTax,
  changeMaxRecommendedDistanceKM,
  changeMaxDeliveryDistanceKM,
  changeBaseDeliveryDistanceKM,
  changeBaseDeliveryTax,
  changeTaxPerExtraKM,

  quitCompanyOperation
} = slice.actions;

export default slice.reducer