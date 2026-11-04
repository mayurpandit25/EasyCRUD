import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaSpinner, FaCheck } from 'react-icons/fa';
import { registerUser } from '../api/userService';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import './StudentRegistration.css';

const StudentRegistration = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addNotification } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: '',
    studentClass: '',
    percentage: '',
    branch: '',
    mobileNumber: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Course options
  const courseOptions = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Business Administration',
    'Data Science',
    'Artificial Intelligence',
    'Cybersecurity',
  ];

  // Branch options
  const branchOptions = [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical',
    'Business',
    'Data Analytics',
    'AI/ML',
    'Network Security',
  ];

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.course) {
      newErrors.course = 'Course is required';
    }

    if (!formData.studentClass.trim()) {
      newErrors.studentClass = 'Highest Education is required';
    }

    if (!formData.percentage) {
      newErrors.percentage = 'Percentage is required';
    } else if (parseFloat(formData.percentage) < 0 || parseFloat(formData.percentage) > 100) {
      newErrors.percentage = 'Percentage must be between 0 and 100';
    }

    if (!formData.branch) {
      newErrors.branch = 'Branch/Stream is required';
    }

    if (!formData.mobileNumber) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Registration mutation
  const registrationMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setIsSubmitting(false);
      toast.success('Student registered successfully!');
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Student has been registered successfully',
      });
      
      // Invalidate and refetch users
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        course: '',
        studentClass: '',
        percentage: '',
        branch: '',
        mobileNumber: '',
      });
      
      // Navigate to students list
      setTimeout(() => {
        navigate('/students');
      }, 1500);
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast.error('Failed to register student. Please try again.');
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to register student. Please try again.',
      });
    },
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    registrationMutation.mutate(formData);
  };

  return (
    <div className="registration-page">
      <div className="registration-container">
        <div className="registration-header">
          <div className="header-icon">
            <FaUserPlus />
          </div>
          <div className="header-content">
            <h1>Student Registration</h1>
            <p>Register a new student in the CLOUDBLITZ system</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-grid">
            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter student's full name"
                maxLength="50"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter email address"
                maxLength="100"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            {/* Course Field */}
            <div className="form-group">
              <label htmlFor="course">Course *</label>
              <select
                id="course"
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                className={`form-input ${errors.course ? 'error' : ''}`}
              >
                <option value="">Select a course</option>
                {courseOptions.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
              {errors.course && <span className="error-message">{errors.course}</span>}
            </div>

            {/* Highest Education Field */}
            <div className="form-group">
              <label htmlFor="studentClass">Highest Education *</label>
              <input
                type="text"
                id="studentClass"
                name="studentClass"
                value={formData.studentClass}
                onChange={handleInputChange}
                className={`form-input ${errors.studentClass ? 'error' : ''}`}
                placeholder="e.g., B.Tech, MCA, B.Sc"
                maxLength="50"
              />
              {errors.studentClass && <span className="error-message">{errors.studentClass}</span>}
            </div>

            {/* Percentage Field */}
            <div className="form-group">
              <label htmlFor="percentage">Percentage (%) *</label>
              <input
                type="number"
                id="percentage"
                name="percentage"
                value={formData.percentage}
                onChange={handleInputChange}
                className={`form-input ${errors.percentage ? 'error' : ''}`}
                placeholder="Enter percentage (0-100)"
                min="0"
                max="100"
                step="0.01"
              />
              {errors.percentage && <span className="error-message">{errors.percentage}</span>}
            </div>

            {/* Branch Field */}
            <div className="form-group">
              <label htmlFor="branch">Branch/Stream *</label>
              <select
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                className={`form-input ${errors.branch ? 'error' : ''}`}
              >
                <option value="">Select branch/stream</option>
                {branchOptions.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
              {errors.branch && <span className="error-message">{errors.branch}</span>}
            </div>

            {/* Mobile Number Field */}
            <div className="form-group full-width">
              <label htmlFor="mobileNumber">Mobile Number *</label>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                className={`form-input ${errors.mobileNumber ? 'error' : ''}`}
                placeholder="Enter 10-digit mobile number"
                maxLength="10"
              />
              {errors.mobileNumber && <span className="error-message">{errors.mobileNumber}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="spinner" />
                  Registering...
                </>
              ) : (
                <>
                  <FaCheck />
                  Register Student
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentRegistration; 