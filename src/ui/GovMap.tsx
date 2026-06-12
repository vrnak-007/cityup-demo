import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export interface MapMarker {
  id: string
  lng: number
  lat: number
  color: string
  onClick?: () => void
}

interface Props {
  center?: [number, number]
  zoom?: number
  markers?: MapMarker[]
  // When set, clicking the map invokes this with the clicked coordinates.
  onPick?: (lng: number, lat: number) => void
  // A single „dropped" pin (report screen), separate from the data markers.
  pick?: { lng: number; lat: number } | null
  className?: string
}

// Raster OpenStreetMap style — no API key needed, fine for a demo.
const OSM_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
}

function pinElement(color: string): HTMLElement {
  const el = document.createElement('div')
  el.style.cursor = 'pointer'
  el.innerHTML = `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1.5" stroke-linejoin="round">
      <path d="M12 22s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z"/>
      <circle cx="12" cy="10" r="2.5" fill="white" stroke="none"/>
    </svg>`
  return el
}

export function GovMap({
  center = [14.42, 49.93],
  zoom = 15,
  markers = [],
  onPick,
  pick,
  className = '',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markerObjs = useRef<maplibregl.Marker[]>([])
  const pickMarker = useRef<maplibregl.Marker | null>(null)
  const onPickRef = useRef(onPick)
  onPickRef.current = onPick

  // Init map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: OSM_STYLE,
      center,
      zoom,
      attributionControl: { compact: true },
    })
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
    map.on('click', (e) => {
      onPickRef.current?.(e.lngLat.lng, e.lngLat.lat)
    })
    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
    }
    // center/zoom intentionally fixed after init
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync data markers.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    markerObjs.current.forEach((m) => m.remove())
    markerObjs.current = markers.map((mk) => {
      const el = pinElement(mk.color)
      if (mk.onClick) el.addEventListener('click', (ev) => {
        ev.stopPropagation()
        mk.onClick?.()
      })
      return new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([mk.lng, mk.lat])
        .addTo(map)
    })
  }, [markers])

  // Sync the single dropped pin.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (pickMarker.current) {
      pickMarker.current.remove()
      pickMarker.current = null
    }
    if (pick) {
      pickMarker.current = new maplibregl.Marker({
        element: pinElement('var(--gov-blue)'),
        anchor: 'bottom',
      })
        .setLngLat([pick.lng, pick.lat])
        .addTo(map)
    }
  }, [pick])

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden rounded-card border border-line ${className}`}
      style={{ minHeight: 320 }}
    />
  )
}
