import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import resourceTimelinePlugin from '@fullcalendar/resource-timeline' // a plugin!
import scheduleData from '../mock_data/sample_schedule.json';
import interactionPlugin from "@fullcalendar/interaction";
import API from "../api";
import ProfessorSchedule from './ProfessorSchedule';

const AdminSchedule = () => {

    const [filter, setFilter] = useState('');
    const [isFilterVisible, setFilterVisible] = useState(false);
    const [tooltip, setTooltip] = useState(null);
    const [tooltipContent, setTooltipContent] = useState('');
    const [clickedEvents, setClickedEvents] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [resources, setResources] = useState([]);
    const [events, setEvents] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [isCalendarPublished, setIsCalendarPublished] = useState(false);


    useEffect(() => {
        console.log("Schedule: ")
        console.log(events);
        convertEventsToJSONSchedule();
    }, [events]);
    

    function convertJson() {

        let rooms = new Set();
        let roomMap = new Map();
        let updatedResources = [];
        let updatedEvents = [];
        let extractedProfessors = [];

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
        for (let item of schedule) {
            // check if this room has already been added to the rooms map
            if (!roomMap.has(item.room)) {
                roomMap.set(item.room, item.building);

                // add the new room item to the resources

                // Updated this code because i was getting errors when updating
                // resrources with resource.push. So now I create new array and 
                // update the state with the new array
                updatedResources = Array.from(roomMap.entries()).map(([room, building]) => {
                    return {
                        id: room,
                        building: building,
                        title: room
                    };
                });
            }

            //Adding professors, to professor list for filter 
            if (!extractedProfessors.includes(item.professor)) {
                extractedProfessors.push(item.professor);
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
                }
            };


            // add the new schedule item to the events
            if ((scheduleItem.extendedProps.professor.toLowerCase() === filter.toLowerCase()) || filter === '') {
                updatedEvents.push(scheduleItem);
            }

        }

        setProfessors(Array.from(extractedProfessors).sort());
        setResources(updatedResources);
        setEvents(updatedEvents);
        return;
    }

    const fetchData = async () => {
        try {
            const response = await API.get('/administrator');
            setSchedule(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (schedule.length > 0) {
            convertJson(schedule);
        }
    }, [schedule, filter]);

    const convertTime = (time) => {
        return time.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    }

    const handlePublishCalendar = async () => {
        try {
          // If the calendar is already published, send a request to unpublish it.
          if (isCalendarPublished) {
            await API.post('/api/publish', { published: false });
            setIsCalendarPublished(false);
          } else {
            // If the calendar is not published, send a request to publish it.
            await API.post('/api/publish', { published: true });
            setIsCalendarPublished(true);
          }
        } catch (error) {
          console.error("Error publishing/unpublishing calendar:", error);
        }
      };

    const handleMouseEnter = (info) => {
        // // Change event color on hover
        // info.el.style.backgroundColor = '#2a67a4';

        console.log("eventt", info.event)

        const content = `Course: ${info.event.title}\nProfessor: ${info.event.extendedProps.professor}\nBuilding: ${info.event.extendedProps.building}\nRoom: ${info.event.extendedProps.room}\nTime: ${convertTime(info.event.start)} - ${convertTime(info.event.end)}`;

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

    // Define a function to find and update an event in our events state
    const updateEvent = (title, changes) => {
        const index = events.findIndex(event => event.title === title);
        const updatedEvents = [...events];

        //only update resourceId and room if it is not undefined or null
        updatedEvents[index] = {
            ...updatedEvents[index],
            start: changes.start,
            end: changes.end,
            startTime: changes.startTime,
            endTime: changes.endTime,
            resourceId: (changes.resourceId !== undefined && changes.resourceId !== null) ? changes.resourceId : updatedEvents[index].resourceId,
            extendedProps: {
                ...updatedEvents[index].extendedProps,
                room: (changes.resourceId !== undefined && changes.resourceId !== null) ? changes.resourceId : updatedEvents[index].resourceId,
            }
        };
        

        setEvents(updatedEvents);

    }

    const handleEventDrop = (info) => {
        // info.event contains the event that has been moved
        // We want to update this event in our state to reflect this change
    
        const start_formatted = info.event.start.toISOString().split('T')[0] + 'T' + info.event.start.toTimeString().split(' ')[0];
        const end_formatted = info.event.end.toISOString().split('T')[0] + 'T' + info.event.end.toTimeString().split(' ')[0];



        var newResourceId = null;

        if(info.newResource !== null){
            newResourceId = info.newResource.id;
        }



        updateEvent(info.event.title, {
            start: start_formatted,
            end: end_formatted,
            startTime: info.event.start.toLocaleTimeString(undefined, { hour12: false }),
            endTime: info.event.end.toLocaleTimeString(undefined, { hour12: false }),
            resourceId: newResourceId, 
            room: newResourceId
        });

    }
    

    // Define our eventResize handler
    const handleEventResize = (info) => {
        // info.event contains the event that has been resized
        // We want to update this event in our state to reflect this change

        const start_formatted = info.event.start.toISOString().split('T')[0] + 'T' + info.event.start.toTimeString().split(' ')[0]
        const end_formatted = info.event.end.toISOString().split('T')[0] + 'T' + info.event.end.toTimeString().split(' ')[0]


        updateEvent(info.event.title, {
            start: start_formatted,
            end: end_formatted,
            startTime: info.event.start.toLocaleTimeString(undefined, { hour12: false }),
            endTime: info.event.end.toLocaleTimeString(undefined, { hour12: false })
        });
    }

    const convertEventsToJSONSchedule = () => {
        const jsonSchedule = [];

        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            const jsonEvent = {
                start: event.start,
                end: event.end,
                // day: event.start.getDay(),
                coursename: event.title,
                building: event.extendedProps.building,
                room: event.resourceId,
                professor: event.extendedProps.professor,
            }
            jsonSchedule.push(jsonEvent);

        }

        console.log(JSON.stringify(jsonSchedule, null, 2));


        return jsonSchedule;
    }


    return (
        <div>

            <div className="flex justify-right mb-4">
                <div className="absolute z-10 py-3 px-4 bg-white border text-sm text-gray-600 rounded-md shadow-md dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 whitespace-pre">
                <button
                    onClick={handlePublishCalendar}
                    title="Publish Calendar to Professors"
                    aria-pressed="true"
                >
                    {isCalendarPublished ? 'Unpublish Calendar' : 'Publish Calendar to Professors'}
                </button>
                </div>
            </div>


            <div className="flex justify-end mb-4">
                <div className="py-1 px-2 bg-white border text-sm text-gray-600 rounded-md shadow-md dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 whitespace-pre">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="fc-resourceTimelineDay-button fc-button fc-button-primary fc-button-active"
                        title="day view"
                        aria-pressed="true"
                    >
                        <option value="">All Professors</option>
                        {professors.map((professor) => (
                            <option key={professor} value={professor}>
                                {professor}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <FullCalendar
                schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
                plugins={[resourceTimelinePlugin, interactionPlugin]}

                editable={true}
                eventStartEditable={true}
                eventResizableFromStart={true}
                eventDurationEditable={true}
                eventResourceEditable={true}
                selectable={true}
                droppable={true}
                snapDuration={'00:10:00'}

                slotMinTime={'08:00:00'} // 8am
                slotMaxTime={'21:00:00'} // 9pm
                slotDuration={'01:00:00'}

                eventOverlap={false}
                hiddenDays={[0, 6]} // Hide Sunday and Saturday


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
                eventDrop={handleEventDrop}
                eventResize={handleEventResize}


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
            <ProfessorSchedule
                isCalendarPublished={isCalendarPublished}
            />
        </div>
    );
}

export default AdminSchedule;