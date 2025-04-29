import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useParams } from 'react-router';
import './CalendarStyles.scss';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', date: '' });
  const [currentUser, setCurrentUser] = useState(null);  // Initialize currentUser state
  const token = localStorage.getItem("token");

  // Safe loading of current user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    console.log("User Data from localStorage:", userData);  // Debugging step

    if (userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        console.log("Parsed User:", user);  // Log the parsed user object
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      console.log("No user data found in localStorage");
    }
  }, []);

  console.log("Current User:", currentUser);  // Log to check if currentUser is set properly

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/projects/${projectId}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      console.log('Fetched Tasks:', res.data);  // Debugging: Check tasks structure
      setTasks(res.data || []);
    } catch (err) {
      console.error('Error fetching tasks', err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:5000/api/projects/${projectId}/add-task`,
        {
          ...form,
          date: new Date(form.date).toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setForm({ title: '', description: '', date: '' });
      fetchTasks();
      alert('✅ Task added successfully!');
    } catch (err) {
      if (err.response && err.response.status === 403) {
        alert('❌ You do not have permission to add a task.');
      } else {
        console.error('Error adding task', err);
        alert("❌ An error occurred while adding the task.");
      }
    }
  };

  const markCompleted = async (taskId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/projects/${projectId}/calendar/${taskId}/complete`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      fetchTasks();
    } catch (err) {
      console.error('Error marking task as completed', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/projects/${projectId}/calendar/${taskId}/delete`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      fetchTasks(); // Fetch the updated list after deletion
      alert("🗑️ Task deleted!");
    } catch (err) {
      console.error("Error deleting task", err);
      alert("❌ You can only delete your own tasks.");
    }
  };

  const events = tasks
    .filter(task => task.date)
    .map((task) => {
      const start = new Date(task.date);
      const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration

      return {
        id: task._id,
        title: task.completed ? `✅ ${task.title}` : task.title,
        start,
        end,
        allDay: false, // explicitly false
      };
    });


  useEffect(() => {
    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">📅 Shared Calendar</h2>

      <form onSubmit={handleAddTask} className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          type="datetime-local"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
          className="border p-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Add Task
        </button>
      </form>

      <div style={{ height: '600px' }} className="mb-8">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          style={{ height: 500 }}
        />
      </div>

      <div className="container mt-4">
        <h3 className="mb-4">📌 Task List</h3>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {tasks.map((task) => (
            <div className="col" key={task._id}>
              <div className="card h-100 shadow-sm border-0">
                <div className={`card-body ${task.completed ? 'bg-light' : 'bg-white'}`}>
                  <h5 className="card-title d-flex align-items-center justify-content-between">
                    <span>
                      {task.completed ? (
                        <span className="badge bg-success me-2">✅ Completed</span>
                      ) : (
                        <span className="badge bg-warning text-dark me-2">⏳ Pending</span>
                      )}
                      {task.title}
                    </span>
                  </h5>

                  {/* 🗓️ Task date */}
                  <p className="text-muted small mb-1">
                    🗓️ <strong>Date:</strong> {new Date(task.date).toLocaleString()}
                  </p>

                  <p className="card-text">{task.description}</p>
                </div>

                <div className="card-footer d-flex justify-content-between align-items-center bg-white border-0">
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => markCompleted(task._id)}
                    disabled={task.completed}
                  >
                    ✅ Mark as Completed
                  </button>
                  {/* 🗑️ Delete button only for creator */}
                  {currentUser && currentUser.userId && task.createdBy.toString() === currentUser.userId.toString() && (
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteTask(task._id)}>
                      Delete 🗑️
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
