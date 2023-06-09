import React from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import resourceTimelinePlugin from '@fullcalendar/resource-timeline' // a plugin!

import AdminSchedule from './components/AdminSchedule'

export default class DemoApp extends React.Component {
  render() {
    return (
      <AdminSchedule />
    )
  }
}