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
import { useMemo, useState } from 'react'
import { useNavigate } from '../../lib/router'
import { useApp } from '../../lib/store'
import { Card } from '../../ui/Card'
import { Sparkline } from '../../ui/Sparkline'
import { ProgressBar } from '../../ui/ProgressBar'
import { StarRating } from '../../ui/StarRating'
import { GovButton } from '../../ui/GovButton'
import { GovMap, type MapMarker } from '../../ui/GovMap'
import { Toggle } from '../../ui/Toggle'
import { ChartIcon } from '../../ui/Icons'
import { formatKc } from '../../lib/format'
import {
  SUBMISSIONS_PER_MONTH,
  FEES_PER_MONTH,
  TOP_AGENDAS,
} from '../../lib/mockData'
import { SLA_TREND } from '../../data/dashboard'
import { CouncilReport } from './CouncilReport'

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

// Pins colored by how long a podnět has been open / took to resolve.
function resolutionColor(dni: number): string {
  if (dni <= 3) return 'var(--success)'
  if (dni <= 7) return 'var(--warning)'
  return 'var(--error)'
}

export function Dashboard() {
  const { podani, poplatky, reports } = useApp()
  const navigate = useNavigate()
  const [opakovane, setOpakovane] = useState(false)
  const [showReport, setShowReport] = useState(false)

  const m = useMemo(() => {
    const vyrizene = podani.filter((p) => p.stav === 'vyrizeno')
    const doLhuty = vyrizene.filter((p) => (p.dobaVyrizeniDni ?? 0) <= 5).length
    const slaPct = vyrizene.length
      ? Math.round((doLhuty / vyrizene.length) * 100)
      : 0
    const hodnocena = podani.filter((p) => p.hodnoceni != null)
    const spokojenost = hodnocena.length
      ? hodnocena.reduce((s, p) => s + (p.hodnoceni ?? 0), 0) / hodnocena.length
      : 0
    const predpis = poplatky.reduce((s, p) => s + p.predpis, 0)
    const vybrano = poplatky
      .filter((p) => p.zaplaceno)
      .reduce((s, p) => s + p.predpis, 0)
    const vybranoPct = Math.round((vybrano / predpis) * 100)
    const dluzi = poplatky.filter((p) => !p.zaplaceno).length
    const podnetyVyreseno = reports.filter((r) => r.status === 'vyrizeno').length
    return {
      vyrizene: vyrizene.length,
      slaPct,
      spokojenost,
      hodnocenoPocet: hodnocena.length,
      predpis,
      vybrano,
      vybranoPct,
      dluzi,
      podnetyVyreseno,
    }
  }, [podani, poplatky, reports])

  const markers: MapMarker[] = reports.map((r) => ({
    id: r.id,
    lng: r.lng,
    lat: r.lat,
    color: opakovane
      ? r.duplicitOf
        ? 'var(--error)'
        : 'var(--line)'
      : resolutionColor(r.dniOtevreno ?? 0),
  }))

  const duplicitni = reports.filter((r) => r.duplicitOf)

  return (
    <div className="mx-auto w-full max-w-app px-4 pb-12 pt-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-display text-ink">Přehled obce</h1>
          <p className="mt-2 text-body text-ink-soft">
            Digitalizace agend obce Hvozdnice
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-caption text-ink-soft">Aktualizováno dnes 7:00</span>
          <GovButton onClick={() => setShowReport(true)}>
            <ChartIcon size={18} />
            Vygenerovat měsíční report
          </GovButton>
        </div>
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

      {/* SLA + spokojenost + výběr poplatků */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card className="flex flex-col gap-2">
          <span className="text-label text-ink-soft">Plnění lhůty 5 dnů</span>
          <span className="tnum text-display text-ink">{m.slaPct} %</span>
          <Sparkline values={SLA_TREND.map((t) => t.pct)} />
          <span className="text-caption text-ink-soft">trend za 6 měsíců</span>
        </Card>

        <Card className="flex flex-col gap-2">
          <span className="text-label text-ink-soft">Spokojenost občanů</span>
          <span className="tnum text-display text-ink">
            {m.spokojenost.toFixed(1).replace('.', ',')} / 5
          </span>
          <StarRating value={Math.round(m.spokojenost)} readOnly size={22} />
          <span className="text-caption text-ink-soft">
            z {m.hodnocenoPocet} hodnocení po vyřízení
          </span>
        </Card>

        <Card className="flex flex-col gap-2">
          <span className="text-label text-ink-soft">Výběr poplatků 2026</span>
          <span className="tnum text-h2 font-semibold text-ink">
            {formatKc(m.vybrano)}{' '}
            <span className="text-label font-normal text-ink-soft">
              z {formatKc(m.predpis)}
            </span>
          </span>
          <ProgressBar value={m.vybranoPct} />
          <button
            onClick={() => navigate('urednik/poplatky')}
            className="gov-focus self-start rounded text-caption font-medium text-gov-blue hover:underline"
          >
            dluží {m.dluzi} poplatníků — řešit v agendě úředníka →
          </button>
        </Card>
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

      {/* Mapa podnětů s dobou řešení + opakované problémy */}
      <Card className="mt-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-h2 text-ink">Podněty v obci</h2>
          <div className="flex items-center gap-4">
            {!opakovane ? (
              <div className="flex items-center gap-4 text-caption">
                <span className="inline-flex items-center gap-2 text-ink">
                  <span className="h-2 w-2 rounded-full" style={{ background: 'var(--success)' }} />
                  do 3 dnů
                </span>
                <span className="inline-flex items-center gap-2 text-ink">
                  <span className="h-2 w-2 rounded-full" style={{ background: 'var(--warning)' }} />
                  do 7 dnů
                </span>
                <span className="inline-flex items-center gap-2 text-ink">
                  <span className="h-2 w-2 rounded-full" style={{ background: 'var(--error)' }} />
                  déle
                </span>
              </div>
            ) : (
              <span className="text-caption text-error">
                Zvýrazněny opakované problémy
              </span>
            )}
            <span className="inline-flex items-center gap-2 text-label text-ink">
              Opakované problémy
              <Toggle
                checked={opakovane}
                onChange={setOpakovane}
                label="Opakované problémy"
              />
            </span>
          </div>
        </div>
        <GovMap markers={markers} className="h-[420px]" />
        {opakovane && duplicitni.length > 0 && (
          <p className="mt-4 text-caption text-ink-soft">
            Nalezen {Math.floor(duplicitni.length / 2)} pár podnětů stejné
            kategorie do 80 m od sebe — pravděpodobně stejný problém hlášený
            vícekrát.
          </p>
        )}
      </Card>

      <p className="mt-6 text-caption text-ink-soft">
        Data jsou ilustrativní (demo). Vytížení úředníků se sleduje pouze jako
        počet otevřených podání (kapacita), nikoli jako žebříček výkonu.
      </p>

      {showReport && (
        <CouncilReport
          onClose={() => setShowReport(false)}
          metrics={{
            podaniCelkem: 1284,
            digitalPct: 73,
            slaPct: m.slaPct,
            spokojenost: m.spokojenost,
            predpis: m.predpis,
            vybrano: m.vybrano,
            vybranoPct: m.vybranoPct,
            dluzi: m.dluzi,
            podnetyVyreseno: m.podnetyVyreseno,
          }}
        />
      )}
    </div>
  )
}
