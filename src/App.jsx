import { useContext } from 'react';
import { Routes, Route } from 'react-router';

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import Product from './components/Product/Product';
import ProductDetails from './components/ProductDetails/ProductDetails';
import ProductForm from './components/ProductForm/ProductForm';
import CartItem from './components/CartItem/CartItem';
import Order from './components/Order/Order';
import OrderDetails from './components/OrderDetails/OrderDetails';
import Service from './components/Service/Service';
import ServiceDetails from './components/ServiceDetails/ServiceDetails';
import ServiceForm from './components/ServiceForm/ServiceForm';
import MyBooking from './components/MyBooking/MyBooking';
import Booking from './components/Booking/Booking';

import ProtectedAdminRoute from '../utils/ProtectedAdminRoute';
import ProtectedOrdersRoute from '../utils/ProtectedOrdersRoute';

import { UserContext } from './contexts/UserContext';

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  // Access the user object from UserContext
  // This gives us the currently logged-in user's information (username, email) that we extract from the token
  const { user } = useContext(UserContext);

  return (
    <>
      <NavBar/>
      <Routes>
        {/* if the user is logged in we have the user object else we have the user set to null */}
        <Route path='/' element={user?.is_admin ? <Dashboard /> : <Product />} />
        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path='/sign-in' element={<SignInForm />} />
        <Route path='/products' element={<Product user={user} />} />
        <Route path='/products/:id' element={<ProductDetails user={user} />} />
        <Route path='/services' element={<Service user={user} />} />
        <Route path='/services/:id' element={<ServiceDetails user={user} />} />
        <Route path='/bookings/me' element={<MyBooking />} />
        
        <Route path='/products/create' element={
          <ProtectedAdminRoute user={user}>

          <ProductForm user={user}/>

          </ProtectedAdminRoute>
        } 
        />

        <Route path='/services/create' element={
          <ProtectedAdminRoute user={user}>

          <ServiceForm user={user}/>

          </ProtectedAdminRoute>
        } 
        />
        
        <Route path='/bookings/admin' element={<ProtectedAdminRoute user={user}>
          <Booking /></ProtectedAdminRoute>
        } 
        />
        <Route path='/products/:id/update' element={<ProtectedAdminRoute user={user}>
          <ProductForm user={user}/></ProtectedAdminRoute>
        } 
        />
        <Route path='/services/:id/update' element={<ProtectedAdminRoute user={user}>
          <ServiceForm user={user}/></ProtectedAdminRoute>
        } 
        />
        <Route path="/orders" element={<ProtectedOrdersRoute user={user}>
        <Order user={user} /></ProtectedOrdersRoute>
        } 
        />
        <Route path="/orders/:id" element={<ProtectedOrdersRoute user={user}>
        <OrderDetails user={user} /></ProtectedOrdersRoute>
        } 
        />

        <Route path='/cart-items/:id' element={<CartItem/>}/>
        <Route path='cart-items/:id/update' element={<CartItem/>}/>
        <Route path='/orders' element={<Order user={user}/>}/>
        <Route path='/orders/:id' element={<OrderDetails user={user} />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
};

export default App;
