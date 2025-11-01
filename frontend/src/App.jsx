import { useEffect } from 'react'
import './App.css'
import Header from './component/Header'
import UserPage from './pages/UserPage'
import OwnerLandingPage from './pages/OwnerLandingPage'
import { useGetOwner } from '../hooks/useGetOwner'
import { useSelector } from 'react-redux'
import { useGetUser } from '../hooks/useGetUser'

function App() {
  // Fetch owner data (might check localStorage or API)
  useGetOwner()
  useGetUser()
  // Access Redux store
  const ownerData = useSelector((state) => state.owner.ownerData)
  const userData = useSelector((state)=>state.user.userData)


  return (
    <section className="flex min-h-screen">
      <Header />
      <section className=" w-screen">
        {userData ? <UserPage /> : <OwnerLandingPage />}
      </section>
    </section>
  )
}

export default App
