import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import API from "../api";
import UserContext from '../contexts/UserContext';

const ProfessorSchedule = () => {
    
    const [tooltip, setTooltip] = useState(null);
    const [tooltipContent, setTooltipContent] = useState('');
    const [ schedule, setSchedule] = useState([]);
    const [ events, setEvents] = useState([]);
    const { user } = useContext(UserContext);

    // Access the user like this:
    function convertJson() {

        let updatedEvents = [];
        let hard_coded_professor = "David Turner";
   
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
            //Only display the event for the desired professor
                let startTime = item.start.split("T")[1];
                let endTime = item.end.split("T")[1];
                const courseTitle = item.coursename.split(' ').slice(-2).join(' ');
                // create the new format for the schedule items
                let scheduleItem = {
                    resourceId: item.room,
                    title: courseTitle,
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
                    updatedEvents.push(scheduleItem);
            }
        

        setEvents(updatedEvents);
        return;
    }

    const fetchData = async () => {
        try{
            const config = {
                headers:{
                  name: user?.username,
                  year: 2024,
                  semester: 1
                }
              };
            const configure = {
            headers:{
                year: 2024,
                semester: 1
            }
            };
            const response = await API.get('/schedule', config);
            const published = await API.get('/publish', configure);
            if(published.data.published == false){
                setSchedule([]);
            }else{
                setSchedule(response.data);

            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData();
      }, []);
    
      useEffect(() => {
        if(schedule.length > 0){
            convertJson(schedule);
        }
      }, [schedule]);

    const convertTime = (time24) => {
        let [hours, minutes] = time24.split(':');
        const suffix = hours >= 12 ? 'PM' : 'AM';
        hours = ((hours % 12) || 12) + ':' + minutes + ' ' + suffix;
        return hours;
    }      

    const handleMouseEnter = (info) => {

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

        setTooltip(null);
        setTooltipContent('');
    }

    const eventContent = (arg) => {
        // Customize the event content to only show the event title
        return (
          <div className="fc-content">{arg.event.title}</div>
        );
      };;

    return (
        <div className="mb-4 ml-5 mr-5">
            <FullCalendar schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"               
                plugins={[timeGridPlugin]} 
                
                slotMinTime={'08:00:00'} // 8am
                slotMaxTime={'21:00:00'} // 9pm
                slotDuration={'01:00:00'}
                eventOverlap={false}
                resourceAreaWidth={'20%'}
                headerToolbar={{
                    left: 'prev,next',
                    center: 'title',
                    right: ''
                }}
                initialView='timeGridWeek'
                resourceGroupField='building'
                contentHeight={'auto'}
                events={events}
                allDaySlot = {false}
                eventMouseEnter={handleMouseEnter}
                eventMouseLeave={handleMouseLeave}
                eventContent={eventContent} 

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

export default ProfessorSchedule;