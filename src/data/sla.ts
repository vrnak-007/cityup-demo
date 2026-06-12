// 5-day service deadline, phrased the human way („3. den z 5", not „SLA 60 %").
export const SLA_DNI = 5

export interface SlaLabel {
  text: string
  level: 'ok' | 'over'
}

// Day of submission counts as day 1.
export function slaLabel(podanoDni: number): SlaLabel {
  const den = podanoDni + 1
  if (den <= SLA_DNI) {
    return { text: `${den}. den z ${SLA_DNI}`, level: 'ok' }
  }
  return { text: `${den}. den — po lhůtě`, level: 'over' }
}
