import React from 'react';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import resourceTimelinePlugin from '@fullcalendar/resource-timeline' // a plugin!
import scheduleData from '../mock_data/sample_schedule.json';


function convertJson(input) {
    let events = [];
    let resources = [];
    let rooms = new Set();

    // map day names to numbers
    const dayMap = {
        "Sunday": 0,
        "Monday": 1,
        "Tuesday": 2,
        "Wednesday": 3,
        "Thursday": 4,
        "Friday": 5,
        "Saturday": 6
    }

    // iterate over each item in the schedule
    for (let item of input.schedule) {
        // check if this room has already been added to the rooms set
        if (!rooms.has(item.room)) {
            rooms.add(item.room);
            // create the new format for the room items
            let roomItem = {
                id: item.room,
                building: item.building,
                title: item.room
            };
            // add the new room item to the resources
            resources.push(roomItem);
        }

        let startTime = item.start.split("T")[1];
        let endTime = item.end.split("T")[1];

        // create the new format for the schedule items
        let scheduleItem = {
            resourceId: item.room,
            title: item.coursename,
            start: item.start,
            end: item.end,
            startTime: startTime,
            endTime: endTime,
            daysOfWeek: item.day.map(day => dayMap[day])
        };
        // add the new schedule item to the events
        events.push(scheduleItem);
    }
    return { resources, events };
}

const { resources, events } = convertJson(scheduleData);

const AdminSchedule = () => {
    return (
        <div>
            <FullCalendar
                schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
                plugins={[resourceTimelinePlugin]}
                editable={true}
                headerToolbar={{
                    left: 'today prev,next',
                    center: 'title',
                    right: 'resourceTimelineDay,resourceTimelineWeek'
                }}
                initialView='resourceTimelineDay'
                resourceGroupField='building'
                resources={resources}
                contentHeight={'auto'}
                events={events}
            />
        </div>
    );
}

export default AdminSchedule;
