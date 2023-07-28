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
  const [all_professors, setAllProfessors] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState('');
  const [temporaryProfessor, setTemporaryProfessor] = useState('');
  const [publishStatus, setPublishStatus] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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


      // Check item.section. Make it a different colour for if it is A01, A02, A03, etc.


      var colour = '#FFFFFF';
      if (item.section.includes('A')) {
        colour = '#3788D8';
      }
      else if (item.section.includes('B')) {
        colour = '#ea292c';
      }
      else if (item.section.includes('T')) {
        colour = '#fdb813';
      }


      let startTime = item.start.split("T")[1];
      let endTime = item.end.split("T")[1];

      // create the new format for the schedule items
      let scheduleItem = {
        id: item.id, // Assuming that the items in the schedule have an ID property
        type: item.type, // And that they also have a type property
        section: item.section,
        resourceId: item.room,
        title: item.coursename,
        start: item.start,
        end: item.end,
        startTime: startTime,
        endTime: endTime,
        daysOfWeek: item.day.map(day => dayMap[day]),
        color: colour,



        extendedProps: {
          professor: item.professor,
          building: item.building,
          room: item.room,
        }
        // set colour based on type

      };

      console.log("scheduleItem", scheduleItem)


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
      const config = {
        headers:{
          year: 2022,
          semester: 9
        }
      };
        const sched = await API.get('/schedule', config);
        const published = await API.get('/publish', config);
        console.log(published.data.published);
        setPublishStatus(published.data.published);
        setSchedule(sched.data);
    } catch (error) {
        console.error(error);
    }
}

  async function fetchProfessorList() {
    try {
      const response = await API.get('/instructors');
      setAllProfessors(response.data);

    } catch (error) {
        console.error(error);
    }
}

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchProfessorList();
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


    const content = `Course: ${info.event.title}\nSection: ${info.event.extendedProps.section}\nProfessor: ${info.event.extendedProps.professor}\nBuilding: ${info.event.extendedProps.building}\nRoom: ${info.event.extendedProps.room}\nTime: ${convertTime(info.event.start)} - ${convertTime(info.event.end)}`;

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

    // console.log("event", info.event)

    setTemporaryProfessor('')
    // open modal
    document.getElementById('modal').classList.remove('hidden');


    document.getElementById('modal-child').classList.remove('opacity-0');

    // populate modal content
    document.querySelector('#event-title').textContent = `${info.event.title} (${info.event.extendedProps.section})`;
    document.querySelector('#event-professor').textContent = info.event.extendedProps.professor;
    document.querySelector('#event-building').textContent = info.event.extendedProps.building;
    document.querySelector('#event-room').textContent = info.event.extendedProps.room;
    document.querySelector('#event-time').textContent = `${convertTime(info.event.start)} - ${convertTime(info.event.end)}`;


  };

// Define a function to find and update an event in our events state
const updateEvent = (id, changes) => {
  const index = events.findIndex(event => event.id === id);
  const updatedEvents = [...events];

  // only update fields if they are not undefined or null
  updatedEvents[index] = {
    ...updatedEvents[index],
    id: changes.id !== undefined ? changes.id : updatedEvents[index].id,
    type: changes.type !== undefined ? changes.type : updatedEvents[index].type,
    section: changes.section !== undefined ? changes.section : updatedEvents[index].section,
    start: changes.start !== undefined ? changes.start : updatedEvents[index].start,
    end: changes.end !== undefined ? changes.end : updatedEvents[index].end,
    startTime: changes.startTime !== undefined ? changes.startTime : updatedEvents[index].startTime,
    endTime: changes.endTime !== undefined ? changes.endTime : updatedEvents[index].endTime,
    resourceId: changes.resourceId !== undefined && changes.resourceId !== null ? changes.resourceId : updatedEvents[index].resourceId,
    extendedProps: {
      ...updatedEvents[index].extendedProps,
      room: changes.room !== undefined && changes.room !== null ? changes.room : updatedEvents[index].extendedProps.room,
      building: changes.building !== undefined ? changes.building : updatedEvents[index].extendedProps.building,
      professor: changes.professor !== undefined ? changes.professor : updatedEvents[index].extendedProps.professor,
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
  if (info.newResource !== null) {
    newResourceId = info.newResource.id;
  }

  var building = null;
  if (info.newResource?.extendedProps?.building) {
    building = info.newResource.extendedProps.building;
  }
  else {
    building = info.oldEvent.extendedProps.building;
  }

  updateEvent(info.event.id, {
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

  updateEvent(info.event.id, {
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

    console.log(JSON.stringify(jsonSchedule, null, 2));


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

        rerenderDelay={10}
        // lazyFetching={true}

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

        // eventOverlap={false}
        hiddenDays={[0, 6]} // Hide Sunday and Saturday


        resourceAreaWidth={'20%'}

        customButtons={{
            publishButton: {
                text: loading ? 'Loading...' : (publishStatus ? 'Unpublish' : 'Publish'),
                click: async function() {
                    // const output = await API.post('/schedule');
                    // console.log(output.data.publishStatus);
                    setLoading(true);
                    try{
                    const data = {
                      published: !publishStatus
                    }
                    const config = {
                      headers:{
                        term: "202401",
                      }
                    };
                    const result = await API.post('/publish',data,config);
                    setPublishStatus(result.data.published);
                  } catch (error){

                  }
                  setLoading(false)
                },
            },
            saveButton: {
                text: loading ? 'Loading...' : (saving ? 'Saving...' : 'Save'),
                click: async function() {
                    // const output = await API.post('/schedule');
                    // console.log(output.data.publishStatus);
                    setSaving(true);
                    try{
                    const data = {
                      published: !publishStatus
                    }
                    const config = {
                      headers:{
                        term: "202401",
                      }
                    };
                    const result = await API.post('/publish',data,config);
                    setPublishStatus(result.data.published);
                  } catch (error){

                  }
                  setSaving(false)
                },
            }
        }}

        headerToolbar={{
          left: 'today prev,next publishButton saveButton',
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
                    value={temporaryProfessor}
                    onChange={(e) => {
                      setTemporaryProfessor(e.target.value);
                    }}
                    className="fc-resourceTimelineDay-button fc-button fc-button-primary fc-button-active"
                    aria-pressed="true"
                  >
                    <option id='event-professor' value=''>
                      Select Professor
                    </option>
                    {
                      all_professors.instructors
                        ? all_professors.instructors.map((professor, index) =>
                          <option value={professor} key={index}>
                            {professor}
                          </option>
                        )
                        : null
                    }
                  </select>
                </div>
              </div>
              {/* End Professor Dropdown */}


              {/* Building Dropdown */}
              <div class="mb-4 w-full flex items-center justify-between">
                <p className='px-2'>Building:</p>
                <div className="py-1 px-2 bg-white border text-sm text-gray-600 rounded-md shadow-md dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 whitespace-pre">
                  <select
                    className="fc-resourceTimelineDay-button fc-button fc-button-primary fc-button-active"

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
                    className="fc-resourceTimelineDay-button fc-button fc-button-primary fc-button-active"

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
                    className="fc-resourceTimelineDay-button fc-button fc-button-primary fc-button-active"

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
              <button type="button" onClick={() => {
                setSelectedProfessor(temporaryProfessor);
                updateEvent(document.querySelector('#event-title').textContent, { professor: temporaryProfessor });
              }}
                class="p-4 w-full inline-flex justify-center items-center gap-2 rounded-br-xl border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800" data-hs-overlay="#modal">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>



    </div>
  );
}

export default AdminSchedule;