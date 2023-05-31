import { createSlice} from '@reduxjs/toolkit'


const authSlice = createSlice({

     name: "auth",
     initialState: {
          isLoggedIn: false,
          ishostLoggedIn: false,
          user: null,
          host: null,
          hotelData: null,
          hotelDetails: null,
          reservation: null,
          userImage: null,
          personalInfo: null,
          searchInput: "",
          homeHotels:null,
          searchHotels:null,
          admin:null,
          isadminLoggedIn:false,
          
     },


     reducers: {

          logIn: (state) => {
               state.isLoggedIn = true;
          },
          louOut: (state, action) => {
               state.isLoggedIn = false;
          },

          adminLogIn: (state) => {
               state.isadminLoggedIn = true;
          },
          adminLogOut: (state, action) => {
               state.isadminLoggedIn = false;
          },

          hostLogin: (state) => {
               state.ishostLoggedIn = true;
          },
          hostLogOut: (state, action) => {
               state.ishostLoggedIn = false;
          },

          setUser: (state, action) => {
               state.user = action.payload
          },
          setHost: (state, action) => {
               state.host = action.payload
          },

          setAdmin: (state, action) => {
               state.admin = action.payload
          },
          removeUser: (state, action) => {
               state.user = null
          },

          removeAdmin: (state, action) => {
               state.admin = null
          },
          removeHost: (state, action) => {
               state.host = null
          },
          setHotelData: (state, action) => {
               state.hotelData = action.payload
          },
          removeHotelData: (state, action) => {
               state.hotelData = null
          },
          setReservation: (state, action) => {
               state.reservation = action.payload
          },
          removeReservation: (state, action) => {
               state.reservation = null
          },
          setUserImage: (state, action) => {
               state.userImage = action.payload
          },
          removeUserImage: (state, action) => {
               state.userImage = null
          },
          settemporaryUser: (state, action) => {
               state.personalInfo = action.payload
          },
          removetemporaryUser: (state, action) => {
               state.personalInfo = null
          },

          setHotel: (state, action) => {
               state.hotelDetails = action.payload
          },
          removeHotel: (state, action) => {
               state.hotelDetails = null
          },
          setSearchInput: (state, action) => {
               state.searchInput = action.payload
          },
          removeSearchInput: (state, aciton) => {
               state.searchInput = ""
          },
          setHomeHotels :(state,action)=>{
               state.homeHotels = action.payload
          },
          removeHomeHotels:(state,aciton)=>{
                state.homeHotels = null
          },
          setsearchHotels :(state,action)=>{
               state.searchHotels = action.payload
          },
          removesearchHotels:(state,aciton)=>{
                state.searchHotels = null
          }

     }
})


export const authactions = authSlice.actions
export const userReducer = authSlice.reducer;
