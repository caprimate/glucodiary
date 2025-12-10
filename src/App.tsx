import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { GlucoseReading } from './types'
import Auth from './components/Auth'
import GlucoseForm from './components/GlucoseForm'
import GlucoseChart from './components/GlucoseChart'
import GlucoseTable from './components/GlucoseTable'

function App() {
  const [user, setUser] = useState<any>(null)
  const [readings, setReadings] = useState<GlucoseReading[]>([])

  const loadReadings = async (userId: string) => {
    const { data } = await supabase
      .from('glucose_readings')
      .select('*')
      .eq('user_id', userId)
      .order('measured_at', { ascending: false })
    setReadings(data || [])
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) loadReadings(session.user.id)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadReadings(session.user.id)
      else setReadings([])
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (!user) return <Auth />

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-5xl mx-auto p-6">
        <header className="flex justify-between items-center mb-10 pt-6">
          <h1 className="text-5xl font-bold text-indigo-800">GlucoDiary</h1>
          <button
            onClick={() => supabase.auth.signOut()}
            className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
          >
            Cerrar sesión
          </button>
        </header>

        <GlucoseForm onSave={() => loadReadings(user.id)} />
        
        <div className="grid lg:grid-cols-2 gap-8 mt-12">
          <GlucoseChart readings={readings} />
          <GlucoseTable readings={readings} onDelete={() => loadReadings(user.id)} />
        </div>
      </div>
    </div>
  )
}

export default App
