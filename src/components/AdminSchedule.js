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
  const [schedule, setSchedule] = useState([]);
  const [resources, setResources] = useState([]);
  const [events, setEvents] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [isCalendarPublished, setIsCalendarPublished] = useState(false);


  useEffect(() => {
    // console.log("Schedule: ")
    // console.log(events);
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

  // async function fetchProfessorData() {
  //   try {

  //     console.log(await API);

  //     const response = await API.get('/rooms');
  //     console.log(response.data)
  //     return response.data;
  //   }
  //   catch (error) {
  //     console.error(error);
  //   }
  // }

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

  const handleMouseEnter = (info) => {
    // // Change event color on hover
    // info.el.style.backgroundColor = '#2a67a4';

    // console.log("event", info.event)

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
    // const clickedId = info.event.id;
    // const eventEl = info.el;

    // open modal
    document.getElementById('modal').classList.remove('hidden');


    document.getElementById('modal-child').classList.remove('opacity-0');

    // populate modal content
    document.querySelector('#event-title').textContent = info.event.title;
    document.querySelector('#event-professor').textContent = info.event.extendedProps.professor;
    document.querySelector('#event-building').textContent = info.event.extendedProps.building;
    document.querySelector('#event-room').textContent = info.event.extendedProps.room;
    document.querySelector('#event-time').textContent = `${convertTime(info.event.start)} - ${convertTime(info.event.end)}`;





  };

  // Define a function to find and update an event in our events state
  const updateEvent = (title, changes) => {
    const index = events.findIndex(event => event.title === title);
    const updatedEvents = [...events];

    // console.log(changes);

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
        building: changes.building,
      }
    };


    setEvents(updatedEvents);

  }

  const handleEventDrop = (info) => {
    // info.event contains the event that has been moved
    // We want to update this event in our state to reflect this change

    const start_formatted = info.event.start.toISOString().split('T')[0] + 'T' + info.event.start.toTimeString().split(' ')[0];
    const end_formatted = info.event.end.toISOString().split('T')[0] + 'T' + info.event.end.toTimeString().split(' ')[0];


    console.log(info)
    
    var newResourceId = null;
    if (info.newResource !== null) {
      newResourceId = info.newResource.id;
    }
    
    
    var building = null;
    if (info.newResource?.extendedProps?.building) {
      building = info.newResource.extendedProps.building;
    }
    else{
      building = info.oldEvent.extendedProps.building;
    }
    
    updateEvent(info.event.title, {
      start: start_formatted,
      end: end_formatted,
      startTime: info.event.start.toLocaleTimeString(undefined, { hour12: false }),
      endTime: info.event.end.toLocaleTimeString(undefined, { hour12: false }),
      resourceId: newResourceId,
      room: newResourceId,
      building: building,
    });
    
  }
  

  // Define our eventResize handler
  const handleEventResize = (info) => {
    // info.event contains the event that has been resized
    // We want to update this event in our state to reflect this change
    
    const start_formatted = info.event.start.toISOString().split('T')[0] + 'T' + info.event.start.toTimeString().split(' ')[0]
    const end_formatted = info.event.end.toISOString().split('T')[0] + 'T' + info.event.end.toTimeString().split(' ')[0]
    
    console.log(info)

    updateEvent(info.event.title, {
      start: start_formatted,
      end: end_formatted,
      startTime: info.event.start.toLocaleTimeString(undefined, { hour12: false }),
      endTime: info.event.end.toLocaleTimeString(undefined, { hour12: false }),
      building: info.event.extendedProps.building,
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

    // console.log(JSON.stringify(jsonSchedule, null, 2));


    return jsonSchedule;
  }


  return (
    <div>
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

      {/* Modal */}

      <div class="text-center">
        <button type="button" class="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800" data-hs-overlay="#modal">
          Open modal
        </button>
      </div>

      <div id="modal" class="hs-overlay hidden w-full h-full fixed top-0 left-0 z-[60] overflow-x-hidden overflow-y-auto flex items-center justify-center">
        <div id="modal-child" class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
          <div class="relative flex flex-col bg-white shadow-2xl rounded-xl dark:bg-gray-800">
            <div class="absolute top-2 right-2">
              <button type="button" class="inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-gray-500 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800" data-hs-overlay="#modal">
                <span class="sr-only">Close</span>
                <svg class="w-3.5 h-3.5" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z" fill="currentColor" />
                </svg>
              </button>
            </div>

            <div class="p-4 sm:px-20 overflow-y-auto flex flex-col items-start justify-center w-full">

              <div class="flex justify-center w-full">
                <h3 id="event-title" class="mb-5 text-2xl font-bold text-gray-800 dark:text-gray-200"></h3>
              </div>

              {/* Professor Dropdown */}
              <div class="mb-4 w-full flex items-center justify-between">
                <p className='px-2'>Professor:</p>
                <div className="py-1 px-2 bg-white border text-sm text-gray-600 rounded-md shadow-md dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 whitespace-pre">
                  <select
                    // value={filter}
                    // onChange={(e) => setFilter(e.target.value)}
                    className="fc-resourceTimelineDay-button fc-button fc-button-primary fc-button-active"
                    title="day view"
                    aria-pressed="true"
                  >
                    {/* CHANGE TO USE NEW API INSTEAD */}
                    <option id='event-professor'>
                      Select Professor
                    </option>
                  </select>
                </div>
              </div>
              {/* End Professor Dropdown */}

              {/* Building Dropdown */}
              <div class="mb-4 w-full flex items-center justify-between">
                <p className='px-2'>Building:</p>
                <div className="py-1 px-2 bg-white border text-sm text-gray-600 rounded-md shadow-md dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 whitespace-pre">
                  <select
                    // value={filter}
                    // onChange={(e) => setFilter(e.target.value)}
                    className="fc-resourceTimelineDay-button fc-button fc-button-primary fc-button-active"
                    title="day view"
                    aria-pressed="true"
                  >
                    {/* CHANGE TO USE NEW API INSTEAD */}
                    <option id='event-building'>
                      Select Building
                    </option>
                  </select>
                </div>
              </div>
              {/* End Building Dropdown */}

              {/* Room Dropdown */}
              <div class="mb-4 w-full flex items-center justify-between">
                <p className='px-2'>Room:</p>
                <div className="py-1 px-2 bg-white border text-sm text-gray-600 rounded-md shadow-md dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 whitespace-pre">
                  <select
                    // value={filter}
                    // onChange={(e) => setFilter(e.target.value)}
                    className="fc-resourceTimelineDay-button fc-button fc-button-primary fc-button-active"
                    title="day view"
                    aria-pressed="true"
                  >
                    {/* CHANGE TO USE NEW API INSTEAD */}
                    <option id='event-room'>
                      Select Room
                    </option>
                  </select>
                </div>
              </div>
              {/* End Room Dropdown */}

              {/* Time Dropdowns */}
              <div class="mb-4 w-full flex items-center justify-between">
                <p className='px-2'>Time:</p>
                <div className="py-1 px-2 bg-white border text-sm text-gray-600 rounded-md shadow-md dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 whitespace-pre">
                  <select
                    // value={filter}
                    // onChange={(e) => setFilter(e.target.value)}
                    className="fc-resourceTimelineDay-button fc-button fc-button-primary fc-button-active"
                    title="day view"
                    aria-pressed="true"
                  >
                    {/* CHANGE TO USE NEW API INSTEAD */}
                    <option id='event-time'>
                      Select Time
                    </option>
                  </select>
                </div>
              </div>
              {/* End Time Dropdowns */}

            </div>



            <div class="flex items-center">
              <button type="button" class="p-4 w-full inline-flex justify-center items-center gap-2 rounded-bl-xl bg-gray-100 border border-transparent font-semibold text-gray-800 hover:text-blue-600 focus:outline-none focus:ring-2 ring-offset-white focus:ring-gray-100 focus:ring-offset-2 transition-all text-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-600 dark:text-white dark:focus:ring-offset-gray-800" data-hs-overlay="#modal">
                Cancel
              </button>
              <button type="button" class="p-4 w-full inline-flex justify-center items-center gap-2 rounded-br-xl border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800" data-hs-overlay="#modal">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Table Section --> */}
      <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        {/* <!-- Card --> */}
        <div class="flex flex-col">
          <div class="-m-1.5 overflow-x-auto">
            <div class="p-1.5 min-w-full inline-block align-middle">
              <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700">
                {/* <!-- Header --> */}
                <div class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-gray-700">


                  <div class="sm:col-span-2 md:grow">
                    <div class="flex justify-end gap-x-2">
                      <div class="hs-dropdown relative inline-block [--placement:bottom-right]">
                        <button id="hs-as-table-table-export-dropdown" type="button" class="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800">
                          <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                          </svg>
                          Export
                        </button>
                        <div class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden mt-2 divide-y divide-gray-200 min-w-[12rem] z-10 bg-white shadow-md rounded-lg p-2 mt-2 dark:divide-gray-700 dark:bg-gray-800 dark:border dark:border-gray-700" aria-labelledby="hs-as-table-table-export-dropdown">
                          <div class="py-2 first:pt-0 last:pb-0">
                            <span class="block py-2 px-3 text-xs font-medium uppercase text-gray-400 dark:text-gray-600">
                              Options
                            </span>
                            <a class="flex items-center gap-x-3 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300" href="#">
                              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
                              </svg>
                              Copy
                            </a>
                            <a class="flex items-center gap-x-3 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300" href="#">
                              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
                                <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z" />
                              </svg>
                              Print
                            </a>
                          </div>
                          <div class="py-2 first:pt-0 last:pb-0">
                            <span class="block py-2 px-3 text-xs font-medium uppercase text-gray-400 dark:text-gray-600">
                              Download options
                            </span>
                            <a class="flex items-center gap-x-3 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300" href="#">
                              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M5.884 6.68a.5.5 0 1 0-.768.64L7.349 10l-2.233 2.68a.5.5 0 0 0 .768.64L8 10.781l2.116 2.54a.5.5 0 0 0 .768-.641L8.651 10l2.233-2.68a.5.5 0 0 0-.768-.64L8 9.219l-2.116-2.54z" />
                                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                              </svg>
                              Excel
                            </a>
                            <a class="flex items-center gap-x-3 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300" href="#">
                              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM3.517 14.841a1.13 1.13 0 0 0 .401.823c.13.108.289.192.478.252.19.061.411.091.665.091.338 0 .624-.053.859-.158.236-.105.416-.252.539-.44.125-.189.187-.408.187-.656 0-.224-.045-.41-.134-.56a1.001 1.001 0 0 0-.375-.357 2.027 2.027 0 0 0-.566-.21l-.621-.144a.97.97 0 0 1-.404-.176.37.37 0 0 1-.144-.299c0-.156.062-.284.185-.384.125-.101.296-.152.512-.152.143 0 .266.023.37.068a.624.624 0 0 1 .246.181.56.56 0 0 1 .12.258h.75a1.092 1.092 0 0 0-.2-.566 1.21 1.21 0 0 0-.5-.41 1.813 1.813 0 0 0-.78-.152c-.293 0-.551.05-.776.15-.225.099-.4.24-.527.421-.127.182-.19.395-.19.639 0 .201.04.376.122.524.082.149.2.27.352.367.152.095.332.167.539.213l.618.144c.207.049.361.113.463.193a.387.387 0 0 1 .152.326.505.505 0 0 1-.085.29.559.559 0 0 1-.255.193c-.111.047-.249.07-.413.07-.117 0-.223-.013-.32-.04a.838.838 0 0 1-.248-.115.578.578 0 0 1-.255-.384h-.765ZM.806 13.693c0-.248.034-.46.102-.633a.868.868 0 0 1 .302-.399.814.814 0 0 1 .475-.137c.15 0 .283.032.398.097a.7.7 0 0 1 .272.26.85.85 0 0 1 .12.381h.765v-.072a1.33 1.33 0 0 0-.466-.964 1.441 1.441 0 0 0-.489-.272 1.838 1.838 0 0 0-.606-.097c-.356 0-.66.074-.911.223-.25.148-.44.359-.572.632-.13.274-.196.6-.196.979v.498c0 .379.064.704.193.976.131.271.322.48.572.626.25.145.554.217.914.217.293 0 .554-.055.785-.164.23-.11.414-.26.55-.454a1.27 1.27 0 0 0 .226-.674v-.076h-.764a.799.799 0 0 1-.118.363.7.7 0 0 1-.272.25.874.874 0 0 1-.401.087.845.845 0 0 1-.478-.132.833.833 0 0 1-.299-.392 1.699 1.699 0 0 1-.102-.627v-.495Zm8.239 2.238h-.953l-1.338-3.999h.917l.896 3.138h.038l.888-3.138h.879l-1.327 4Z" />
                              </svg>
                              .CSV
                            </a>
                            <a class="flex items-center gap-x-3 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300" href="#">
                              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                                <path d="M4.603 14.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.697 19.697 0 0 0 1.062-2.227 7.269 7.269 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a10.954 10.954 0 0 0 .98 1.686 5.753 5.753 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.856.856 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.712 5.712 0 0 1-.911-.95 11.651 11.651 0 0 0-1.997.406 11.307 11.307 0 0 1-1.02 1.51c-.292.35-.609.656-.927.787a.793.793 0 0 1-.58.029zm1.379-1.901c-.166.076-.32.156-.459.238-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361.01.022.02.036.026.044a.266.266 0 0 0 .035-.012c.137-.056.355-.235.635-.572a8.18 8.18 0 0 0 .45-.606zm1.64-1.33a12.71 12.71 0 0 1 1.01-.193 11.744 11.744 0 0 1-.51-.858 20.801 20.801 0 0 1-.5 1.05zm2.446.45c.15.163.296.3.435.41.24.19.407.253.498.256a.107.107 0 0 0 .07-.015.307.307 0 0 0 .094-.125.436.436 0 0 0 .059-.2.095.095 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a3.876 3.876 0 0 0-.612-.053zM8.078 7.8a6.7 6.7 0 0 0 .2-.828c.031-.188.043-.343.038-.465a.613.613 0 0 0-.032-.198.517.517 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822.024.111.054.227.09.346z" />
                              </svg>
                              .PDF
                            </a>
                          </div>
                        </div>
                      </div>

                      <div class="hs-dropdown relative inline-block [--placement:bottom-right]" data-hs-dropdown-auto-close="inside">
                        <button id="hs-as-table-table-filter-dropdown" type="button" class="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800">
                          <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                          </svg>
                          Filter
                          <span class="pl-2 text-xs font-semibold text-blue-600 border-l border-gray-200 dark:border-gray-700 dark:text-blue-500">
                            1
                          </span>
                        </button>
                        <div class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden mt-2 divide-y divide-gray-200 min-w-[12rem] z-10 bg-white shadow-md rounded-lg mt-2 dark:divide-gray-700 dark:bg-gray-800 dark:border dark:border-gray-700" aria-labelledby="hs-as-table-table-filter-dropdown">
                          <div class="divide-y divide-gray-200 dark:divide-gray-700">
                            <label for="hs-as-filters-dropdown-all" class="flex py-2.5 px-3">
                              <input type="checkbox" class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-as-filters-dropdown-all" checked />
                              <span class="ml-3 text-sm text-gray-800 dark:text-gray-200">All</span>
                            </label>
                            <label for="hs-as-filters-dropdown-published" class="flex py-2.5 px-3">
                              <input type="checkbox" class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-as-filters-dropdown-published" />
                              <span class="ml-3 text-sm text-gray-800 dark:text-gray-200">Published</span>
                            </label>
                            <label for="hs-as-filters-dropdown-pending" class="flex py-2.5 px-3">
                              <input type="checkbox" class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-as-filters-dropdown-pending" />
                              <span class="ml-3 text-sm text-gray-800 dark:text-gray-200">Pending</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <!-- End Header --> */}

                {/* <!-- Table --> */}
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-slate-800">
                    <tr>
                      <th scope="col" class="px-6 py-3 text-left">
                        <div class="flex items-center gap-x-2">
                          <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                            Product
                          </span>
                        </div>
                      </th>

                      <th scope="col" class="px-6 py-3 text-left">
                        <div class="flex items-center gap-x-2">
                          <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                            Reviewer
                          </span>
                        </div>
                      </th>

                      <th scope="col" class="px-6 py-3 text-left">
                        <div class="flex items-center gap-x-2">
                          <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                            Review
                          </span>
                        </div>
                      </th>

                      <th scope="col" class="px-6 py-3 text-left">
                        <div class="flex items-center gap-x-2">
                          <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                            Date
                          </span>
                        </div>
                      </th>

                      <th scope="col" class="px-6 py-3 text-left">
                        <div class="flex items-center gap-x-2">
                          <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                            Status
                          </span>
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr class="bg-white hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-800">
                      <td class="h-px w-px whitespace-nowrap">
                        <a class="block h-full p-6" href="#">
                          <div class="flex items-center gap-x-4">
                            <img class="flex-shrink-0 h-[2.375rem] w-[2.375rem] rounded-md" src="https://images.unsplash.com/photo-1572307480813-ceb0e59d8325?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=320&q=80" alt="Image Description" />
                            <div>
                              <span class="block text-sm font-semibold text-gray-800 dark:text-gray-200">Brown Hat</span>
                            </div>
                          </div>
                        </a>
                      </td>
                      <td class="h-px w-px whitespace-nowrap">
                        <a class="block h-full p-6" href="#">
                          <div class="flex items-center gap-x-3">
                            <img class="inline-block h-[2.375rem] w-[2.375rem] rounded-full" src="https://images.unsplash.com/photo-1531927557220-a9e23c1e4794?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" alt="Image Description" />
                            <div class="grow">
                              <span class="block text-sm font-semibold text-gray-800 dark:text-gray-200">Christina Bersh</span>
                              <span class="block text-sm text-gray-500">christina@site.com</span>
                            </div>
                          </div>
                        </a>
                      </td>
                      <td class="h-px w-72 min-w-[18rem]">
                        <a class="block h-full p-6" href="#">
                          <div class="flex gap-x-1 mb-2">
                            <svg class="w-3 h-3 text-gray-800 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                            <svg class="w-3 h-3 text-gray-800 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                            <svg class="w-3 h-3 text-gray-800 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                            <svg class="w-3 h-3 text-gray-800 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                            <svg class="w-3 h-3 text-gray-800 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                          </div>
                          <span class="block text-sm font-semibold text-gray-800 dark:text-gray-200">I just love it!</span>
                          <span class="block text-sm text-gray-500">I bought this hat for my boyfriend, but then i found out he cheated on me so I kept it and I love it!! I wear it all the time and there is no problem with the fit even though its a mens" hat.</span>
                        </a>
                      </td>
                      <td class="h-px w-px whitespace-nowrap">
                        <a class="block h-full p-6" href="#">
                          <span class="text-sm text-gray-600 dark:text-gray-400">10 Jan 2022</span>
                        </a>
                      </td>
                      <td class="h-px w-px whitespace-nowrap">
                        <a class="block h-full p-6" href="#">
                          <span class="inline-flex items-center gap-1.5 py-0.5 px-2 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <svg class="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                            </svg>
                            Published
                          </span>
                        </a>
                      </td>
                    </tr>

                    <tr class="bg-white hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-800">
                      <td class="h-px w-px whitespace-nowrap">
                        <a class="block h-full p-6" href="#">
                          <div class="flex items-center gap-x-4">
                            <img class="flex-shrink-0 h-[2.375rem] w-[2.375rem] rounded-md" src="https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=320&q=80" alt="Image Description" />
                            <div>
                              <span class="block text-sm font-semibold text-gray-800 dark:text-gray-200">Calvin Klein T-shirts</span>
                            </div>
                          </div>
                        </a>
                      </td>
                      <td class="h-px w-px whitespace-nowrap">
                        <a class="block h-full p-6" href="#">
                          <div class="flex items-center gap-x-3">
                            <img class="inline-block h-[2.375rem] w-[2.375rem] rounded-full" src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" alt="Image Description" />
                            <div class="grow">
                              <span class="block text-sm font-semibold text-gray-800 dark:text-gray-200">David Harrison</span>
                              <span class="block text-sm text-gray-500">david@site.com</span>
                            </div>
                          </div>
                        </a>
                      </td>
                      <td class="h-px w-72 min-w-[18rem]">
                        <a class="block h-full p-6" href="#">
                          <div class="flex gap-x-1 mb-2">
                            <svg class="w-3 h-3 text-gray-800 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                            <svg class="w-3 h-3 text-gray-800 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                            <svg class="w-3 h-3 text-gray-800 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                            <svg class="w-3 h-3 text-gray-800 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                            <svg class="w-3 h-3 text-gray-800 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                          </div>
                          <span class="block text-sm font-semibold text-gray-800 dark:text-gray-200">Really nice</span>
                          <span class="block text-sm text-gray-500">Material is great and very comfortable and stylish.</span>
                        </a>
                      </td>
                      <td class="h-px w-px whitespace-nowrap">
                        <a class="block h-full p-6" href="#">
                          <span class="text-sm text-gray-600 dark:text-gray-400">04 Aug 2020</span>
                        </a>
                      </td>
                      <td class="h-px w-px whitespace-nowrap">
                        <a class="block h-full p-6" href="#">
                          <span class="inline-flex items-center gap-1.5 py-0.5 px-2 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            <svg class="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
                            </svg>
                            Rejected
                          </span>
                        </a>
                      </td>
                    </tr>

                    <tr class="bg-white hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-800">
                      <td class="h-px w-px whitespace-nowrap">
                        <a class="block h-full p-6" href="#">
                          <div class="flex items-center gap-x-4">
                            <img class="flex-shrink-0 h-[2.375rem] w-[2.375rem] rounded-md" src="https://images.unsplash.com/photo-1626947346165-4c2288dadc2a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=320&q=80" alt="Image Description" />
                            <div>
                              <span class="block text-sm font-semibold text-gray-800 dark:text-gray-200">Clarks shoes</span>
                            </div>
                          </div>
                        </a>
                      </td>
                      <td class="h-px w-px whitespace-nowrap">
                        <a class="block h-full p-6" href="#">
                          <div class="flex items-center gap-x-3">
                            <span class="inline-flex items-center justify-center h-[2.375rem] w-[2.375rem] rounded-full bg-gray-300 dark:bg-gray-700">
                              <span class="font-medium text-gray-800 leading-none dark:text-gray-200">A</span>
                            </span>
                            <div class="grow">
                              <span class="block text-sm font-semibold text-gray-800 dark:text-gray-200">Anne Richard</span>
                              <span class="block text-sm text-gray-500">anne@site.com</span>
                            </div>
                          </div>
                        </a>
                      </td>
                      <td class="h-px w-72 min-w-[18rem]">
                        <a class="block h-full p-6" href="#">
                          <div class="flex gap-x-1 mb-2">
                            <svg class="w-3 h-3 text-gray-800 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                            <svg class="w-3 h-3 text-gray-800 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                            <svg class="w-3 h-3 text-gray-800 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                            <svg class="w-3 h-3 text-gray-800 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                            <svg class="w-3 h-3 text-gray-400 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                          </div>
                          <span class="block text-sm font-semibold text-gray-800 dark:text-gray-200">Good product</span>
                          <span class="block text-sm text-gray-500">A really well built shoe. It looks great and wears just as well. A great staple in ball caps.</span>
                        </a>
                      </td>
                      <td class="h-px w-px whitespace-nowrap">
                        <a class="block h-full p-6" href="#">
                          <span class="text-sm text-gray-600 dark:text-gray-400">June 18 2022</span>
                        </a>
                      </td>
                      <td class="h-px w-px whitespace-nowrap">
                        <a class="block h-full p-6" href="#">
                          <span class="inline-flex items-center gap-1.5 py-0.5 px-2 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <svg class="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                            </svg>
                            Published
                          </span>
                        </a>
                      </td>
                    </tr>

                    <tr class="bg-white hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-800">
                      <td class="h-px w-px whitespace-nowrap">
                        <a class="block h-full p-6" href="#">
                          <div class="flex items-center gap-x-4">
                            <img class="flex-shrink-0 h-[2.375rem] w-[2.375rem] rounded-md" src="https://images.unsplash.com/photo-1598554747436-c9293d6a588f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=320&q=80" alt="Image Description" />
                            <div>
                              <span class="block text-sm font-semibold text-gray-800 dark:text-gray-200">Levis women's jeans</span>
                            </div>
                          </div>
                        </a>
                      </td>
                      <td class="h-px w-px whitespace-nowrap">
                        <a class="block h-full p-6" href="#">
                          <div class="flex items-center gap-x-3">
                            <img class="inline-block h-[2.375rem] w-[2.375rem] rounded-full" src="https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&&auto=format&fit=facearea&facepad=3&w=300&h=300&q=80" alt="Image Description" />
                            <div class="grow">
                              <span class="block text-sm font-semibold text-gray-800 dark:text-gray-200">Samia Kartoon</span>
                              <span class="block text-sm text-gray-500">samia@site.com</span>
                            </div>
                          </div>
                        </a>
                      </td>
                      <td class="h-px w-72 min-w-[18rem]">
                        <a class="block h-full p-6" href="#">
                          <div class="flex gap-x-1 mb-2">
                            <svg class="w-3 h-3 text-gray-800 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                            <svg class="w-3 h-3 text-gray-800 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                            <svg class="w-3 h-3 text-gray-800 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                            <svg class="w-3 h-3 text-gray-800 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                            <svg class="w-3 h-3 text-gray-800 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                          </div>
                          <span class="block text-sm font-semibold text-gray-800 dark:text-gray-200">Buy the product, you will not regret it!</span>
                          <span class="block text-sm text-gray-500">Don't let this merchandise get away! It's a must buy and you will look good in it while working out.</span>
                        </a>
                      </td>
                      <td class="h-px w-px whitespace-nowrap">
                        <a class="block h-full p-6" href="#">
                          <span class="text-sm text-gray-600 dark:text-gray-400">10 Jan 2022</span>
                        </a>
                      </td>
                      <td class="h-px w-px whitespace-nowrap">
                        <a class="block h-full p-6" href="#">
                          <span class="inline-flex items-center gap-1.5 py-0.5 px-2 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <svg class="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                            </svg>
                            Published
                          </span>
                        </a>
                      </td>
                    </tr>

                    <tr class="bg-white hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-800">
                      <td class="h-px w-px whitespace-nowrap">
                        <a class="block h-full p-6" href="#">
                          <div class="flex items-center gap-x-4">
                            <img class="flex-shrink-0 h-[2.375rem] w-[2.375rem] rounded-md" src="https://images.unsplash.com/photo-1594032194509-0056023973b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=320&q=80" alt="Image Description" />
                            <div>
                              <span class="block text-sm font-semibold text-gray-800 dark:text-gray-200">Asos T-shirts</span>
                            </div>
                          </div>
                        </a>
                      </td>
                      <td class="h-px w-px whitespace-nowrap">
                        <a class="block h-full p-6" href="#">
                          <div class="flex items-center gap-x-3">
                            <span class="inline-flex items-center justify-center h-[2.375rem] w-[2.375rem] rounded-full bg-gray-300 dark:bg-gray-700">
                              <span class="font-medium text-gray-800 leading-none dark:text-gray-200">D</span>
                            </span>
                            <div class="grow">
                              <span class="block text-sm font-semibold text-gray-800 dark:text-gray-200">David Harrison</span>
                              <span class="block text-sm text-gray-500">david@site.com</span>
                            </div>
                          </div>
                        </a>
                      </td>
                      <td class="h-px w-72 min-w-[18rem]">
                        <a class="block h-full p-6" href="#">
                          <div class="flex gap-x-1 mb-2">
                            <svg class="w-3 h-3 text-gray-800 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                            <svg class="w-3 h-3 text-gray-800 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                            <svg class="w-3 h-3 text-gray-800 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                            <svg class="w-3 h-3 text-gray-800 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                            <svg class="w-3 h-3 text-gray-400 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                          </div>
                          <span class="block text-sm font-semibold text-gray-800 dark:text-gray-200">Ready for the heat!</span>
                          <span class="block text-sm text-gray-500">As good as the heat Rdy T-shirt but without the sleeves. Love the stripes on the back.</span>
                        </a>
                      </td>
                      <td class="h-px w-px whitespace-nowrap">
                        <a class="block h-full p-6" href="#">
                          <span class="text-sm text-gray-600 dark:text-gray-400">07 May 2022</span>
                        </a>
                      </td>
                      <td class="h-px w-px whitespace-nowrap">
                        <a class="block h-full p-6" href="#">
                          <span class="inline-flex items-center gap-1.5 py-0.5 px-2 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <svg class="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                            </svg>
                            Published
                          </span>
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
                {/* <!-- End Table --> */}

                {/* <!-- Footer --> */}
                <div class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-gray-700">
                  <div class="max-w-sm space-y-3">
                    <select class="py-2 px-3 pr-9 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400">
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option selected>5</option>
                      <option>6</option>
                    </select>
                  </div>

                  <div>
                    <div class="inline-flex gap-x-2">
                      <button type="button" class="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800">
                        <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                        </svg>
                        Prev
                      </button>

                      <button type="button" class="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800">
                        Next
                        <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                {/* <!-- End Footer --> */}
              </div>
            </div>
          </div>
        </div>
        {/* <!-- End Card --> */}
      </div>
      {/* <!-- End Table Section --> */}

    </div>
  );
}

export default AdminSchedule;