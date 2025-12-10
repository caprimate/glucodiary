import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { GlucoseReading } from '../types'

interface Props {
  readings: GlucoseReading[]
}

export default function GlucoseChart({ readings }: Props) {
  const data = readings
    .slice()
    .reverse()
    .map(r => ({
      fecha: new Date(r.measured_at).toLocaleDateString('es-ES'),
      antes: r.before_eating || null,
      después: r.after_eating || null
    }))

  if (readings.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <p className="text-gray-500 text-lg">Aún no hay mediciones. ¡Empieza a registrar!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Evolución de la glucosa</h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="antes" stroke="#3b82f6" name="Antes de comer" strokeWidth={3} dot={{ r: 5 }} />
          <Line type="monotone" dataKey="después" stroke="#10b981" name="2h después" strokeWidth={3} dot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
