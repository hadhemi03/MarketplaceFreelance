import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary chart elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,  // For Pie chart
  Title,
  Tooltip,
  Legend
);

const DashboardDefault = () => {
  const [analytics, setAnalytics] = useState(null);

  // Fetch analytics data from the backend
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard/analytics', {
          withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setAnalytics(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };
    fetchAnalytics();
  }, []);

  if (!analytics) {
    return <div>Loading...</div>;
  }

  // Monthly Growth (Bar Chart)
  const monthlyGrowthData = {
    labels: analytics.monthlyGrowth.map((_, index) => `Month ${index + 1}`),
    datasets: [
      {
        label: 'Monthly Payments (DT)',
        data: analytics.monthlyGrowth,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)',
        hoverBorderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  // Projects by Status (Pie Chart)
  const projectsStatusData = {
    labels: ['Waiting', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [
          analytics.projectsByStatus.Waiting,
          analytics.projectsByStatus['In Progress'],
          analytics.projectsByStatus.Completed,
        ],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)'],
        hoverBackgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(75, 192, 192, 0.8)'],
        hoverBorderColor: 'rgba(0, 0, 0, 0.1)',
      },
    ],
  };

  return (
    <div className="container-fluid p-5 bg-light">

      <div className="row">
  {/* Total Clients */}
  <div className="col-md-3 mb-4">
    <div className="card shadow-lg border-0 rounded-3" style={{ backgroundColor: '#f8d7da' }}>
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5 className="card-title text-dark">Total Clients</h5>
          <p className="card-text fs-3 text-dark">{analytics.totalClients}</p>
        </div>
        <div>
          <i className="fas fa-users fa-3x text-danger"></i> {/* Icon */}
        </div>
      </div>
    </div>
  </div>

  {/* Total Freelancers */}
  <div className="col-md-3 mb-4">
    <div className="card shadow-lg border-0 rounded-3" style={{ backgroundColor: '#d1ecf1' }}>
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5 className="card-title text-dark">Total Freelancers</h5>
          <p className="card-text fs-3 text-dark">{analytics.totalFreelancers}</p>
        </div>
        <div>
          <i className="fas fa-chalkboard-teacher fa-3x text-info"></i> {/* Icon */}
        </div>
      </div>
    </div>
  </div>

  {/* Total Projects */}
  <div className="col-md-3 mb-4">
    <div className="card shadow-lg border-0 rounded-3" style={{ backgroundColor: '#d4edda' }}>
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5 className="card-title text-dark">Total Projects</h5>
          <p className="card-text fs-3 text-dark">{analytics.totalProjects}</p>
        </div>
        <div>
          <i className="fas fa-briefcase fa-3x text-success"></i> {/* Icon */}
        </div>
      </div>
    </div>
  </div>

  {/* Total Payments */}
  <div className="col-md-3 mb-4">
    <div className="card shadow-lg border-0 rounded-3" style={{ backgroundColor: '#fff3cd' }}>
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5 className="card-title text-dark">Total Payments</h5>
          <p className="card-text fs-3 text-dark">{analytics.totalPayments} DT</p>
        </div>
      </div>
    </div>
  </div>
</div>


      <div className="row">
        {/* Monthly Growth Bar Chart */}
        <div className="col-md-6 mb-4 d-flex">
          <div className="card shadow-lg border-0 w-100">
            <div className="card-body d-flex flex-column">
              <div className="chart-container flex-grow-1">
                <Bar
                  data={monthlyGrowthData}
                  options={{
                    responsive: true,
                    animation: { duration: 1500 },
                    maintainAspectRatio: false,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Monthly Growth in Payments',
                        font: { size: 16 },
                      },
                    },
                    scales: {
                      x: {
                        grid: { display: false },
                      },
                      y: {
                        beginAtZero: true,
                        grid: { color: '#eee' },
                      },
                    },
                  }}
                  height={250} // Set a consistent height for both charts
                />
              </div>
            </div>
          </div>
        </div>

        {/* Projects Status Pie Chart */}
        <div className="col-md-6 mb-4 d-flex">
          <div className="card shadow-lg border-0 w-100">
            <div className="card-body d-flex flex-column">
              <div className="chart-container flex-grow-1">
                <Pie
                  data={projectsStatusData}
                  options={{
                    responsive: true,
                    animation: { duration: 1500 },
                    maintainAspectRatio: false,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Projects by Status',
                        font: { size: 16 },
                      },
                      tooltip: {
                        callbacks: {
                          label: function (tooltipItem) {
                            return `${tooltipItem.label}: ${tooltipItem.raw} projects`;
                          },
                        },
                      },
                    },
                  }}
                  height={250} // Set a consistent height for both charts
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDefault;
