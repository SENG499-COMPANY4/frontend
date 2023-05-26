import ProfNavbar from './components/ProfNavbar';
import About from './pages/About';
import { Routes, Route } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!

export default function Example() {
  return (
    <div class="container mx-auto px-10 max-w-screen-lg">
      <ProfNavbar></ProfNavbar>
      <Routes>
        <Route path="/about" component={About} />
      </Routes>
      <FullCalendar
        plugins={[ dayGridPlugin ]}
        initialView="dayGridMonth"
      />
    </div>
  )
}
