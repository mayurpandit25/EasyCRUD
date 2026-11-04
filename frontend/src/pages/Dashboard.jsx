import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FaUsers, FaUserPlus, FaGraduationCap, FaChartLine } from 'react-icons/fa';
import { fetchUsers } from '../api/userService';
import { useApp } from '../context/AppContext';
import './Dashboard.css';

const Dashboard = () => {
  const { addNotification } = useApp();

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Calculate statistics
  const stats = {
    totalStudents: users.length,
    recentRegistrations: users.slice(-5).length,
    averagePercentage: users.length > 0 
      ? Math.round(users.reduce((sum, user) => sum + parseFloat(user.percentage || 0), 0) / users.length)
      : 0,
    topCourses: getTopCourses(users),
  };

  function getTopCourses(users) {
    const courseCount = {};
    users.forEach(user => {
      courseCount[user.course] = (courseCount[user.course] || 0) + 1;
    });
    return Object.entries(courseCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([course, count]) => ({ course, count }));
  }

  const recentStudents = users.slice(-4).reverse();

  if (isLoading) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Welcome to CLOUDBLITZ Student Management System</p>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    addNotification({
      type: 'error',
      title: 'Error',
      message: 'Failed to load dashboard data',
    });
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard</h1>
          <p>Welcome to CLOUDBLITZ Student Management System</p>
        </div>
        <Link to="/register" className="cta-button">
          <FaUserPlus />
          Register New Student
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>{stats.totalStudents}</h3>
            <p>Total Students</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon recent">
            <FaUserPlus />
          </div>
          <div className="stat-content">
            <h3>{stats.recentRegistrations}</h3>
            <p>Recent Registrations</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon percentage">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <h3>{stats.averagePercentage}%</h3>
            <p>Average Percentage</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon courses">
            <FaGraduationCap />
          </div>
          <div className="stat-content">
            <h3>{stats.topCourses.length}</h3>
            <p>Active Courses</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Recent Students */}
        <div className="content-section">
          <div className="section-header">
            <h2>Recent Students</h2>
            <Link to="/students" className="view-all-link">
              View All Students
            </Link>
          </div>
          <div className="students-grid">
            {recentStudents.length > 0 ? (
              recentStudents.map((student) => (
                <div key={student.id} className="student-card">
                  <div className="student-avatar">
                    <FaGraduationCap />
                  </div>
                  <div className="student-info">
                    <h4>{student.name}</h4>
                    <p className="student-course">{student.course}</p>
                    <p className="student-percentage">{student.percentage}%</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <FaUsers className="empty-icon" />
                <p>No students registered yet</p>
                <Link to="/register" className="empty-cta">
                  Register First Student
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Top Courses */}
        <div className="content-section">
          <div className="section-header">
            <h2>Popular Courses</h2>
          </div>
          <div className="courses-list">
            {stats.topCourses.length > 0 ? (
              stats.topCourses.map((course, index) => (
                <div key={course.course} className="course-item">
                  <div className="course-rank">{index + 1}</div>
                  <div className="course-info">
                    <h4>{course.course}</h4>
                    <p>{course.count} students</p>
                  </div>
                  <div className="course-percentage">
                    {Math.round((course.count / stats.totalStudents) * 100)}%
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <FaGraduationCap className="empty-icon" />
                <p>No course data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 