import React from 'react';
import './App.css';
import UserSignupPage from './Pages/UserSignupPage';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom'
import Home from './Pages/HomePage';
import UserLoginpage from './Pages/UserLoginPage';
import HostLogin from './Components/HostComponents/HostLogin/HostLogin';
import HostSignup from './Components/HostComponents/HostSignUp/HostSignup';
import HostdashboardPage from './Pages/HostdashboardPage';
import  "./Components/FontawesomeIcons"
// import AddHotel from './Components/HostComponents/AddHotel/AddHotel';
import HostAddHotelPage from './Pages/Host-AddHotelPage';
import UserProfilepage from './Pages/UserProfilepage';
import SinglePage from './Pages/SinglePage';
import BookingRequestPage from './Pages/BookingRequestPage';
import Sucesspage from './Pages/Stripe/Sucesspage';
import Cancelpage from './Pages/Stripe/Cancelpage';
import Createuserprofilepage from './Pages/Createuserprofilepage';
import HostEditHotelPage from './Pages/Host-EditHotelPage';
import ReservationPage from './Pages/ReservationPage';
import Chatpage from './Pages/Chat/Chatpage';
import HostReservation from './Components/HostComponents/Reservation/HostReservation';
import PaymentHistoryPage from './Pages/PaymentHistory-Page';
import Adminpage from './Pages/Admin/Adminpage';
import Loginpage from './Pages/Admin/Loginpage';
import ErroPage from './Pages/Error/ErroPage';

function App() {

  return (
    
    <div>
    <Router>
      <Routes>
        <Route exact path='/'element = {<Home/>}/>
        <Route path='/usersignup'element = {<UserSignupPage/>}/>
        <Route path='/userlogin'element = {<UserLoginpage/>}/>
        <Route path='/userprofile'element = {<UserProfilepage/>}/>
        <Route path='/singlepage'element = {<SinglePage/>}/>
        <Route path='/requesttobook'element = {<BookingRequestPage/>}/>
        <Route path='/success'element = {<Sucesspage/>}/>
        <Route path='/cancel'element = {<Cancelpage/>}/>
        <Route path='/userprofile/createuserprofile'element = {<Createuserprofilepage/>}/>
        <Route path='/trips'element = {<ReservationPage/>}/>
        <Route path='/paymenthistory'element = {<PaymentHistoryPage/>}/>

        <Route path='/host'element = {<HostdashboardPage/>}/>
        <Route path='/host/hostlogin'element = {<HostLogin/>}/>
        <Route path='/host/hostsignup'element = {<HostSignup/>}/>
        <Route path='/host/addhotel'element = {<HostAddHotelPage/>}/>
        <Route path='/host/edithotel'element = {<HostEditHotelPage />}/>
        <Route path='/host/reservationlist'element = {<HostReservation />}/>

        <Route path='/chat/messages'element = {<Chatpage />}/>
        <Route path='/host/messages'element = {<Chatpage />}/>


        <Route path='/admin'element = {<Adminpage />}/>
        <Route path='/admin/login'element = {<Loginpage />}/>


        <Route path='*'element = {<ErroPage/>}/>

      </Routes>   
    </Router>
      
    </div>

  );
}

export default App;
