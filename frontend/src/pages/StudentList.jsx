import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FaUsers, FaSearch, FaFilter, FaTrash, FaEdit, FaEye, FaPlus } from 'react-icons/fa';
import { fetchUsers, deleteUser } from '../api/userService';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import './StudentList.css';

const StudentList = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch users
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000,
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success('Student deleted successfully');
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Student has been deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => {
      toast.error('Failed to delete student');
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete student. Please try again.',
      });
    },
  });

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.course.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCourse = !filterCourse || user.course === filterCourse;
      return matchesSearch && matchesCourse;
    });

    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'percentage') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else {
        aValue = aValue?.toLowerCase() || '';
        bValue = bValue?.toLowerCase() || '';
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [users, searchTerm, filterCourse, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredAndSortedUsers.slice(startIndex, startIndex + itemsPerPage);

  // Get unique courses for filter
  const uniqueCourses = useMemo(() => {
    const courses = [...new Set(users.map(user => user.course))];
    return courses.sort();
  }, [users]);

  // Handle delete
  const handleDelete = (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      deleteMutation.mutate(userId);
    }
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilterCourse('');
    setSortBy('name');
    setSortOrder('asc');
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="student-list-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-list-page">
        <div className="error-state">
          <FaUsers className="error-icon" />
          <h2>Error Loading Students</h2>
          <p>Failed to load student data. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="student-list-page">
      <div className="list-header">
        <div className="header-content">
          <div className="header-icon">
            <FaUsers />
          </div>
          <div>
            <h1>Student List</h1>
            <p>Manage and view all registered students</p>
          </div>
        </div>
        <Link to="/register" className="add-button">
          <FaPlus />
          Add Student
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="course-filter">Filter by Course:</label>
            <select
              id="course-filter"
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="filter-select"
            >
              <option value="">All Courses</option>
              {uniqueCourses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>

          <button onClick={clearFilters} className="clear-filters">
            <FaFilter />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <p>
          Showing {paginatedUsers.length} of {filteredAndSortedUsers.length} students
          {searchTerm && ` matching "${searchTerm}"`}
          {filterCourse && ` in ${filterCourse}`}
        </p>
      </div>

      {/* Students Table */}
      <div className="table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable">
                Name
                {sortBy === 'name' && (
                  <span className="sort-indicator">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('email')} className="sortable">
                Email
                {sortBy === 'email' && (
                  <span className="sort-indicator">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('course')} className="sortable">
                Course
                {sortBy === 'course' && (
                  <span className="sort-indicator">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th>Education</th>
              <th onClick={() => handleSort('percentage')} className="sortable">
                Percentage
                {sortBy === 'percentage' && (
                  <span className="sort-indicator">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th>Branch</th>
              <th>Mobile</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((student) => (
                <tr key={student.id} className="student-row">
                  <td className="student-name">{student.name}</td>
                  <td className="student-email">{student.email}</td>
                  <td className="student-course">
                    <span className="course-badge">{student.course}</span>
                  </td>
                  <td>{student.studentClass}</td>
                  <td className="student-percentage">
                    <span className={`percentage-badge ${getPercentageClass(student.percentage)}`}>
                      {student.percentage}%
                    </span>
                  </td>
                  <td>{student.branch}</td>
                  <td>{student.mobileNumber}</td>
                  <td className="actions">
                    <button
                      className="action-btn view"
                      title="View Details"
                      onClick={() => {/* TODO: Implement view */}}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="action-btn edit"
                      title="Edit Student"
                      onClick={() => {/* TODO: Implement edit */}}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="action-btn delete"
                      title="Delete Student"
                      onClick={() => handleDelete(student.id, student.name)}
                      disabled={deleteMutation.isPending}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  <div className="empty-state">
                    <FaUsers className="empty-icon" />
                    <p>No students found</p>
                    {searchTerm || filterCourse ? (
                      <button onClick={clearFilters} className="clear-filters-btn">
                        Clear filters
                      </button>
                    ) : (
                      <Link to="/register" className="add-first-btn">
                        Add First Student
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`page-btn ${currentPage === page ? 'active' : ''}`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// Helper function to get percentage class
const getPercentageClass = (percentage) => {
  const num = parseFloat(percentage);
  if (num >= 90) return 'excellent';
  if (num >= 80) return 'good';
  if (num >= 70) return 'average';
  if (num >= 60) return 'below-average';
  return 'poor';
};

export default StudentList; 