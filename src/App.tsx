import { useRoute } from './lib/router'
import { AppChrome } from './ui/AppChrome'
import { Home } from './screens/obcan/Home'
import { Login } from './screens/obcan/Login'
import { DogForm } from './screens/obcan/DogForm'
import { Summary } from './screens/obcan/Summary'
import { Payment } from './screens/obcan/Payment'
import { Status } from './screens/obcan/Status'
import { Profile } from './screens/obcan/Profile'
import { Report } from './screens/obcan/Report'
import { PublicMap } from './screens/obcan/PublicMap'
import { WasteForm } from './screens/obcan/WasteForm'
import { GeneralSubmission } from './screens/obcan/GeneralSubmission'
import { Reservation } from './screens/obcan/Reservation'
import { FileAccess } from './screens/obcan/FileAccess'
import { Grants } from './screens/obcan/Grants'
import { Queue } from './screens/urednik/Queue'
import { SubmissionDetail } from './screens/urednik/SubmissionDetail'
import { Kanban } from './screens/urednik/Kanban'
import { Dashboard } from './screens/starosta/Dashboard'

function Placeholder({ name }: { name: string }) {
  return (
    <div className="mx-auto w-full max-w-form px-4 py-12">
      <h1 className="text-display text-ink">{name}</h1>
      <p className="mt-2 text-body text-ink-soft">Připravujeme…</p>
    </div>
  )
}

export function App() {
  const { role, screen } = useRoute()
  const path = `${role}/${screen}`

  let content
  switch (path) {
    // ---- OBČAN ----
    case 'obcan/uvod':
      content = <Home />
      break
    case 'obcan/prihlaseni':
      content = <Login next="obcan/psi" agenda="Poplatek ze psů" />
      break
    case 'obcan/psi':
      content = <DogForm />
      break
    case 'obcan/souhrn':
      content = <Summary />
      break
    case 'obcan/platba':
      content = <Payment />
      break
    case 'obcan/stav':
      content = <Status />
      break
    case 'obcan/profil':
      content = <Profile />
      break
    case 'obcan/podnet':
      content = <Report />
      break
    case 'obcan/mapa':
      content = <PublicMap />
      break
    // P2 — waste fee (login gate → form)
    case 'obcan/odpad-prihlaseni':
      content = <Login next="obcan/odpad" agenda="Poplatek za odpad" />
      break
    case 'obcan/odpad':
      content = <WasteForm />
      break
    // P2 — general submission (login gate → form)
    case 'obcan/podani-prihlaseni':
      content = <Login next="obcan/podani" agenda="Obecné podání" />
      break
    case 'obcan/podani':
      content = <GeneralSubmission />
      break
    // P2 — reservation
    case 'obcan/rezervace':
      content = <Reservation />
      break
    // P3 — vision screens
    case 'obcan/spis':
      content = <FileAccess />
      break
    case 'obcan/dotace':
      content = <Grants />
      break
    // ---- ÚŘEDNÍK ----
    case 'urednik/fronta':
      content = <Queue />
      break
    case 'urednik/detail':
      content = <SubmissionDetail />
      break
    case 'urednik/podnety':
      content = <Kanban />
      break
    // ---- STAROSTA ----
    case 'starosta/dashboard':
      content = <Dashboard />
      break
    default:
      content = <Placeholder name={path} />
  }

  return <AppChrome>{content}</AppChrome>
}
