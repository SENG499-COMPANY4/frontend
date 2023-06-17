import React from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!

export default class DemoApp extends React.Component {
  render() {
    return (
      <div class="container mx-auto p-10 max-w-screen-2xl">
      <FullCalendar schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives" plugins={[ dayGridPlugin ]} 
      
      events={[
        { title: 'SENG 499', date: '2023-06-07' },
        { title: 'SENG 499', date: '2023-06-14' },
        { title: 'SENG 499', date: '2023-06-21' },
        { title: 'SENG 499', date: '2023-06-28' }
      ]}
      
      />
      </div>
    )
  }
}