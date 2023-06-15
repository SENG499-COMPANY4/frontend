import React from 'react';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import resourceTimelinePlugin from '@fullcalendar/resource-timeline' // a plugin!

import jsonData from '../mock_data/sample_schedule.json';

function convertJson(input) {
    let output = [];

    // iterate over each item in the schedule
    for (let item of input.schedule) {
        // create the new format for the schedule items
        let scheduleItem = {
            resourceId: item.room,
            title: item.coursename,
            start: item.start,
            end: item.end
        };

        // add the new schedule item to the output
        output.push(scheduleItem);

        // create the new format for the room items
        let roomItem = {
            id: item.room,
            building: item.room,
            title: item.room
        };

        // check if this room has already been added to the output
        if (!output.some(outputItem => outputItem.id === roomItem.id)) {
            // add the new room item to the output
            output.push(roomItem);
        }
    }

    return output;
}

  
console.log(convertJson(jsonData));

const AdminSchedule = () => {
    return (<div>
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
            resources={[
                { id: 'ECS123', building: 'Engineering & Computer Science', title: 'ECS 123' },
                { id: 'ECS125', building: 'Engineering & Computer Science', title: 'ECS 125' },
                { id: 'DTBA102', building: 'David Turpin', title: 'ECS 125' },
            ]}
            // slotDuration={'00:10'}
            contentHeight={'auto'}
            events={convertJson(jsonData)}
        />
    </div>
    );
}

export default AdminSchedule;