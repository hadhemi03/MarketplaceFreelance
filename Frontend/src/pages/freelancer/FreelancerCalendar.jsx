import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const FreelancerCalendar = () => {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem('token');

  const fetchFreelancerTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/projects/calendar/freelancer', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setTasks(res.data || []);
    } catch (err) {
      console.error('Error fetching freelancer tasks', err);
    }
  };

  useEffect(() => {
    fetchFreelancerTasks();
  }, []);

  const events = tasks
    .filter(task => task.date)
    .map((task) => {
      const start = new Date(task.date);
      const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration
      return {
        id: task._id,
        title: task.title,
        completed: task.completed,
        projectTitle: task.projectTitle, // Keep project title here
        start,
        end,
        allDay: false,
      };
    });

  // Custom Event Component to render task and project title with pink color
  const CustomEvent = ({ event }) => {
    return (
      <div>
        <div>{event.completed ? '✅ ' : ''}{event.title}</div>
        <div style={{ fontSize: '0.75rem', color: 'pink' }}>{event.projectTitle}</div> {/* Pink color for project name */}
      </div>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">📅 My Calendar</h2>
      <div style={{ height: '600px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          style={{ height: 500 }}
          components={{
            event: CustomEvent, // Use CustomEvent to render tasks with project name below
          }}
        />
      </div>
    </div>
  );
};

export default FreelancerCalendar;
