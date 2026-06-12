import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Card } from '../../ui/Card'
import { formatKc, formatNumber } from '../../lib/format'
import {
  SUBMISSIONS_PER_MONTH,
  FEES_PER_MONTH,
  TOP_AGENDAS,
} from '../../lib/mockData'

const GOV_BLUE = '#2362A2'
const INK_SOFT = '#595959'
const LINE = '#D9D9D9'
// Donut: shades of the municipal blue, lightening down the list.
const BLUES = ['#14457A', '#2362A2', '#4E83BE', '#85AED5', '#B8D0E8']

const KPIS = [
  { value: '1 284', label: 'podání celkem', sub: 'za posledních 12 měsíců' },
  { value: '73 %', label: 'digitálně', sub: 'bez návštěvy úřadu' },
  { value: '412 380 Kč', label: 'uhrazeno online', sub: 'poplatky přes QR a kartu' },
  { value: '428 h', label: 'ušetřený čas', sub: 'občanů i úředníků' },
]

const axisStyle = { fontSize: 13, fill: INK_SOFT }

export function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-app px-4 pb-12 pt-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-display text-ink">Přehled obce</h1>
          <p className="mt-2 text-body text-ink-soft">
            Digitalizace agend obce Hvozdnice
          </p>
        </div>
        <span className="text-caption text-ink-soft">Aktualizováno dnes 7:00</span>
      </div>

      {/* KPI cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {KPIS.map((k) => (
          <Card key={k.label} className="flex flex-col gap-2">
            <span className="tnum text-display text-ink">{k.value}</span>
            <span className="text-label font-medium text-ink">{k.label}</span>
            <span className="text-caption text-ink-soft">{k.sub}</span>
          </Card>
        ))}
      </div>

      {/* Line: submissions per month, digital vs paper */}
      <Card className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-h2 text-ink">Podání za měsíc</h2>
          <div className="flex items-center gap-4 text-caption">
            <span className="inline-flex items-center gap-2 text-ink">
              <span className="h-2 w-4 rounded-full" style={{ background: GOV_BLUE }} />
              Digitálně
            </span>
            <span className="inline-flex items-center gap-2 text-ink-soft">
              <span className="h-2 w-4 rounded-full" style={{ background: INK_SOFT }} />
              Papírově
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={SUBMISSIONS_PER_MONTH} margin={{ left: -16, right: 8 }}>
            <CartesianGrid stroke={LINE} vertical={false} />
            <XAxis dataKey="month" tick={axisStyle} stroke={LINE} tickLine={false} />
            <YAxis tick={axisStyle} stroke={LINE} tickLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: `1px solid ${LINE}`,
                fontSize: 13,
              }}
            />
            <Line
              type="monotone"
              dataKey="digital"
              name="Digitálně"
              stroke={GOV_BLUE}
              strokeWidth={2.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="papir"
              name="Papírově"
              stroke={INK_SOFT}
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Bar: fees collected online per month */}
        <Card>
          <h2 className="mb-4 text-h2 text-ink">Vybráno online (Kč)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={FEES_PER_MONTH} margin={{ left: 8, right: 8 }}>
              <CartesianGrid stroke={LINE} vertical={false} />
              <XAxis dataKey="month" tick={axisStyle} stroke={LINE} tickLine={false} />
              <YAxis
                tick={axisStyle}
                stroke={LINE}
                tickLine={false}
                tickFormatter={(v) => `${Math.round(v / 1000)} tis.`}
              />
              <Tooltip
                cursor={{ fill: 'var(--gov-blue-tint)' }}
                formatter={(v: number) => formatKc(v)}
                contentStyle={{
                  borderRadius: 8,
                  border: `1px solid ${LINE}`,
                  fontSize: 13,
                }}
              />
              <Bar dataKey="kc" name="Vybráno" fill={GOV_BLUE} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Donut: top agendas */}
        <Card>
          <h2 className="mb-4 text-h2 text-ink">Nejčastější agendy</h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie
                  data={TOP_AGENDAS}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {TOP_AGENDAS.map((_, i) => (
                    <Cell key={i} fill={BLUES[i % BLUES.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => `${v} %`}
                  contentStyle={{
                    borderRadius: 8,
                    border: `1px solid ${LINE}`,
                    fontSize: 13,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <ul className="flex flex-1 flex-col gap-2">
              {TOP_AGENDAS.map((a, i) => (
                <li key={a.name} className="flex items-center justify-between gap-2 text-label">
                  <span className="inline-flex min-w-0 items-center gap-2 text-ink">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: BLUES[i % BLUES.length] }}
                    />
                    <span className="truncate">{a.name}</span>
                  </span>
                  <span className="tnum shrink-0 whitespace-nowrap text-ink-soft">
                    {a.value} %
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      <p className="mt-6 text-caption text-ink-soft">
        Data jsou ilustrativní (demo). Hodnoty: {formatNumber(1284)} podání ·
        digitalizace 73 %.
      </p>
    </div>
  )
}
