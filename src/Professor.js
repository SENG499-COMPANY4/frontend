// import FullCalendar from '@fullcalendar/react' // must go before plugins
// import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!

// export default function Example() {
//   return (
//     <div class="container mx-auto px-10 max-w-screen-lg">
//       <FullCalendar
//         plugins={[ dayGridPlugin ]}
//         initialView="dayGridMonth"
//       />
//     </div>
    
//   )
// }


import React from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import resourceTimelinePlugin from '@fullcalendar/resource-timeline' // a plugin!

export default class DemoApp extends React.Component {
  render() {
    return (
      <FullCalendar schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives" plugins={[ resourceTimelinePlugin ]} 
      
      events={[
        { title: 'event 1', date: '2023-06-06' },
        { title: 'event 2', date: '2019-04-02' }
      ]}
      
      />
    )
  }
}