import { supabase } from '../supabase'
import { GlucoseReading } from '../types'

interface Props {
  readings: GlucoseReading[]
  onDelete: () => void
}

export default function GlucoseTable({ readings, onDelete }: Props) {
  const exportCSV = () => {
    const csv = [
      ['Fecha y hora', 'Antes (mg/dL)', 'Después (mg/dL)', 'Notas'],
      ...readings.map(r => [
        new Date(r.measured_at).toLocaleString('es-ES'),
        r.before_eating || '',
        r.after_eating || '',
        r.notes || ''
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'glucodiary_mis_mediciones.csv'
    link.click()
  }

  const deleteReading = async (id: number) => {
    if (!confirm('¿Borrar esta medición?')) return
    await supabase.from('glucose_readings').delete().eq('id', id)
    onDelete()
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Historial completo</h2>
          <button
            onClick={exportCSV}
            className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-gray-100 transition"
          >
            Exportar CSV
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Fecha y hora</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Antes</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Después</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Notas</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {readings.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{new Date(r.measured_at).toLocaleString('es-ES')}</td>
                <td className="px-6 py-4 text-sm font-medium">{r.before_eating || '—'}</td>
                <td className="px-6 py-4 text-sm font-medium">{r.after_eating || '—'}</td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{r.notes || '—'}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => deleteReading(r.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
