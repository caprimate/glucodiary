import { useState } from 'react'
import { supabase } from '../supabase'

interface Props {
  onSave: () => void
}

export default function GlucoseForm({ onSave }: Props) {
  const [before, setBefore] = useState('')
  const [after, setAfter] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('glucose_readings').insert({
      before_eating: before ? Number(before) : null,
      after_eating: after ? Number(after) : null,
      notes: notes || null
    })

    if (error) alert('Error: ' + error.message)
    else {
      setBefore('')
      setAfter('')
      setNotes('')
      onSave()
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Nueva medición</h2>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Antes de comer (mg/dL)
          </label>
          <input
            type="number"
            value={before}
            onChange={(e) => setBefore(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300"
            placeholder="120"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            2h después (mg/dL)
          </label>
          <input
            type="number"
            value={after}
            onChange={(e) => setAfter(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-300"
            placeholder="140"
          />
        </div>
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas (opcional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
            placeholder="Ej: Desayuno con pan y fruta"
          />
        </div>
        <div className="md:col-span-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-60 transition"
          >
            {loading ? 'Guardando…' : 'Guardar medición'}
          </button>
        </div>
      </form>
    </div>
  )
}
