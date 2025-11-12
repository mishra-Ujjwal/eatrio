import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import Header from './component/Header.jsx'
import Footer from './component/Footer.jsx'
import RestaurantRegister from './pages/RestaurantRegister.jsx'
import RestaurantDashboard from './pages/RestaurantDashboard.jsx'
import HomePage from './pages/UserPage.jsx'
import MenuPage from './pages/MenuPage.jsx'
import AddMenuItem from './pages/AddMenuItem.jsx'
import { store } from './redux/store.js'
import { Provider } from 'react-redux'
import Payment from './pages/PaymentPage.jsx'
import OwnerSignup from './pages/OwnerSignup.jsx'
import OwnerLogin from './pages/OwnerLogin.jsx'
import DasboardPage from './pages/Restaurant/DasboardPage.jsx'
import OrderPage from './pages/Restaurant/RestaurantOrdersPage.jsx'
import ProfilePage from './pages/Restaurant/ProfilePage.jsx'
import RestaurantPage from './pages/RestaurantPage.jsx'
import AllMenuPage from './pages/AllMenuPage.jsx'
import CartPage from './pages/CartPage.jsx'
import UserOrderPage from './pages/UserOrderPage.jsx'
const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>
  },{
    path:"/login",
    element:<LoginPage/>
  },{
    path:"/user-dashboard",
    element:<HomePage/>,
  },{
    path:"/:id",
    element:<RestaurantPage/>,
  },{
    path:"/:id/cart",
    element:<CartPage/>,
  },{
    path:"/user-orders",
    element:<UserOrderPage/>
  }
  ,{
    path:"/:id/menu",
    element:<AllMenuPage/>,
  },{
    path:"/owner-signup",
    element:<OwnerSignup/>
  },{
    path:"/owner-login",
    element:<OwnerLogin/>
  },{
    path:"/restaurant/:restaurantId",
    element:<MenuPage/>,
  },{
    path:"/restaurant-register",
    element:<RestaurantRegister/>,
  },{
    path:"/payment",
    element:<Payment/>,
  },{
    path:"/add-menu-item",
    element:<AddMenuItem/>,
  },{
    path:"/signup",
    element:<SignupPage/>
  },{
    path: "/restaurant-dashboard/:id",
    element: <RestaurantDashboard />,
    children: [
      { path: "", element: <DasboardPage /> },
      { path: "menu", element: <MenuPage /> },
      { path: "orders", element: <OrderPage /> },
      { path: "profile", element: <ProfilePage /> },
      
    ],
  },
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
     <Provider store={store}>
    
    <RouterProvider router={router}/>
    <Footer/>
    </Provider>
  </StrictMode>,
)
