import { useEffect } from 'react'
import './App.css'
import Header from './component/Header'
import UserPage from './pages/UserPage'
import OwnerLandingPage from './pages/OwnerLandingPage'
import { useGetOwner } from '../hooks/useGetOwner'
import { useSelector } from 'react-redux'

function App() {
  // Fetch owner data (might check localStorage or API)
  useGetOwner()

  // Access Redux store
  const ownerData = useSelector((state) => state.owner.ownerData)
  const isLoggedIn = !!ownerData // true if data exists

  return (
    <section className="flex min-h-screen">
      <Header />
      <section className="w-screen">
        {isLoggedIn ? <UserPage /> : <OwnerLandingPage />}
      </section>
    </section>
  )
}

export default App
