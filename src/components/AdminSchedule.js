import React from 'react';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import resourceTimelinePlugin from '@fullcalendar/resource-timeline' // a plugin!

const AdminSchedule = () => {
    return (<div>
        <FullCalendar
            schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
            plugins={[resourceTimelinePlugin]}
            headerToolbar={{
                left: 'today prev,next',
                center: 'title',
                right: 'resourceTimelineDay,resourceTimelineWeek'
            }}
            editable={true}
            initialView='resourceTimelineDay'
            resourceGroupField='building'
            resources={[
                { id: 'a', building: '460 Bryant', title: 'Auditorium A' },
                { id: 'b', building: '460 Bryant', title: 'Auditorium B' },
                { id: 'c', building: '460 Bryant', title: 'Auditorium C' },
                { id: 'd', building: '460 Bryant', title: 'Auditorium D' },
                { id: 'e', building: '460 Bryant', title: 'Auditorium E' },
            ]}
            // slotDuration={'00:10'}

            events={[
                { resourceId: 'a', title: 'Event 1', start: '2023-06-09T10:00:00', end: '2023-06-09T10:00:00' },
                { resourceId: 'b', title: 'Event 2', start: '2023-06-09T13:00:00', end: '2023-06-09T15:00:00' },
                { resourceId: 'c', title: 'Event 3', start: '2023-06-10T10:00:00', end: '2023-06-10T12:00:00' },
                { resourceId: 'd', title: 'Event 4', start: '2023-06-11T10:00:00', end: '2023-06-11T12:00:00' },
                { resourceId: 'e', title: 'Event 5', start: '2023-06-12T10:00:00', end: '2023-06-12T12:00:00' },
            ]}
        />
    </div>
    );
}

export default AdminSchedule;