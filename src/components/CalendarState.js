import React, { useState } from 'react';
import AdminSchedule from './AdminSchedule';
import ProfessorSchedule from './ProfessorSchedule';

const CalendarState = () => {
  const [isCalendarPublished, setIsCalendarPublished] = useState(false);

  const handlePublishCalendar = () => {
    setIsCalendarPublished(!isCalendarPublished);
  };

  return (
    <div>
      <AdminSchedule
        isCalendarPublished={isCalendarPublished}
        onPublishCalendar={handlePublishCalendar}
      />
      <ProfessorSchedule isCalendarPublished={isCalendarPublished} />
    </div>
  );
};

export default CalendarState;