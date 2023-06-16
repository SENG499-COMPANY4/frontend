import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import resourceTimelinePlugin from '@fullcalendar/resource-timeline' // a plugin!
import scheduleData from '../mock_data/sample_schedule.json';
import interactionPlugin from "@fullcalendar/interaction";



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
            daysOfWeek: item.day.map(day => dayMap[day]),
            extendedProps: {
                professor: item.professor,
                building: item.building,
                room: item.room,
                startTime: startTime,
                endTime: endTime
            }
        };
        // add the new schedule item to the events
        events.push(scheduleItem);
    }
    return { resources, events };
}

const { resources, events } = convertJson(scheduleData);

const convertTime = (time24) => {
    let [hours, minutes] = time24.split(':');
    const suffix = hours >= 12 ? 'PM' : 'AM';
    hours = ((hours % 12) || 12) + ':' + minutes + ' ' + suffix;
    return hours;
}



const AdminSchedule = () => {

    const [tooltip, setTooltip] = useState(null);
    const [tooltipContent, setTooltipContent] = useState('');
    const [clickedEvents, setClickedEvents] = useState([]);

    const handleMouseEnter = (info) => {
        // // Change event color on hover
        // info.el.style.backgroundColor = '#2a67a4';

        const content = `Course: ${info.event.title}\nProfessor: ${info.event.extendedProps.professor}\nBuilding: ${info.event.extendedProps.building}\nRoom: ${info.event.extendedProps.room}\nTime: ${convertTime(info.event.extendedProps.startTime)} - ${convertTime(info.event.extendedProps.endTime)}`;

        const rect = info.el.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

        setTooltip({
            top: rect.top + scrollTop - 10,
            left: rect.left + scrollLeft + rect.width / 2
        });

        setTooltipContent(content);
    }

    const handleMouseLeave = () => {

        // // Change event color back to default
        // const events = document.getElementsByClassName('fc-event');
        // for (let i = 0; i < events.length; i++) {
        //     events[i].style.backgroundColor = '#3788d8';
        // }

        setTooltip(null);
        setTooltipContent('');
    }

    const handleEventClick = (info) => {
        const clickedId = info.event.id;
        const indexOfClicked = clickedEvents.indexOf(clickedId);
        const eventEl = info.el;
      
        if (indexOfClicked === -1) {
          // Event was not clicked before, add it to clickedEvents and change its color to red
          setClickedEvents([...clickedEvents, clickedId]);
          eventEl.style.backgroundColor = 'red';
        } else {
          // Event was clicked before, remove it from clickedEvents and change its color back to default
          setClickedEvents(clickedEvents.filter(id => id !== clickedId));
          eventEl.style.backgroundColor = '#3788d8';
        }
      };

    return (
        <div>
            <FullCalendar
                schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
                plugins={[resourceTimelinePlugin, interactionPlugin]}
                
                editable={true}
                eventStartEditable={true}
                eventResizableFromStart={true}
                eventDurationEditable={true}
                selectable={true}
                droppable={true}

                slotMinTime={'08:00:00'}
                slotMaxTime={'21:00:00'}
                slotDuration={'01:00:00'}

                resourceAreaWidth={'20%'}

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

                eventMouseEnter={handleMouseEnter}
                eventMouseLeave={handleMouseLeave}
                eventClick={handleEventClick}
            />
            {tooltip &&
                <div className="absolute z-10 py-3 px-4 bg-white border text-sm text-gray-600 rounded-md shadow-md dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 whitespace-pre"
                    style={{ top: tooltip.top, left: tooltip.left, transform: 'translate(-50%, -100%)' }}>
                    {tooltipContent}
                </div>
            }
        </div>
    );
}

export default AdminSchedule;