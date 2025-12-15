import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiChevronLeft, FiChevronRight, FiMail, FiPhone, FiMapPin, FiArrowLeft,
  FiCheckSquare, FiSquare, FiCalendar, FiClock, FiChevronDown
} from 'react-icons/fi';
import './ScheduleInterview.css';

const ScheduleInterview = () => {
  const navigate = useNavigate();

  // --- Global Form State ---
  const [formData, setFormData] = useState({
    email: '',
    duration: '45 minutes',
    meetingLink: 'https://meet.company.com/interview-123',
    interviewerId: 'david',
    priority: 'Medium',
    selectedDate: new Date(2025, 2, 15), // Default to March 15, 2025
    timeSlotId: '09:00',
    sendReminder: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [view, setView] = useState('Month'); // 'Month' | 'Week'

  // --- Dynamic Calendar Logic ---
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 2, 1)); // Start at March 2025

  // Helper: Generate calendar grid for currentMonth
  const generateCalendar = (baseDate) => {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Padding days (empty cells before the 1st)
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null });
    }

    // Actual days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateObj = new Date(year, month, i);
      // Mock logic: Weekends unavailable, random slots for demo
      const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
      const slotsAvailable = isWeekend ? 0 : Math.floor(Math.random() * 5); // 0-4 slots

      days.push({
        day: i,
        fullDate: dateObj,
        available: !isWeekend && slotsAvailable > 0,
        slots: slotsAvailable
      });
    }
    return days;
  };

  const calendarGrid = generateCalendar(currentMonth);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isSameDay = (d1, d2) => {
    return d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();
  };

  // --- Email & Dropdown Logic (From previous step) ---
  const [emailInput, setEmailInput] = useState('');
  const [showEmailOptions, setShowEmailOptions] = useState(false);
  const emailWrapperRef = useRef(null);
  const emailSuggestions = ['michael.chen@email.com', 'm.chen@dev-hiring.com', 'candidate.michael@gmail.com'];

  useEffect(() => {
    function handleClickOutside(event) {
      if (emailWrapperRef.current && !emailWrapperRef.current.contains(event.target)) {
        setShowEmailOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [emailWrapperRef]);

  const handleEmailSelect = (email) => {
    setFormData(prev => ({ ...prev, email }));
    setEmailInput(email);
    setShowEmailOptions(false);
  };

  // --- Interviewer Data ---
  const interviewers = [
    { id: 'david', name: 'David Kim', role: 'Technical Lead', img: 'https://i.pravatar.cc/150?u=david' },
    { id: 'sarah', name: 'Sarah Jenkins', role: 'Senior Architect', img: 'https://i.pravatar.cc/150?u=sarah' }
  ];
  const selectedInterviewer = interviewers.find(i => i.id === formData.interviewerId);

  // --- Time Slots (Mock Dynamic) ---
  // In a real app, you'd fetch these based on formData.selectedDate
  const timeSlots = [
    { id: '09:00', time: '9:00 AM - 9:45 AM', label: formData.selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }), sub: 'Indian Time (IST)' },
    { id: '10:00', time: '10:00 AM - 10:45 AM', label: formData.selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }), sub: 'Indian Time (IST)' },
    { id: '14:00', time: '2:00 PM - 2:45 PM', label: formData.selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }), sub: 'Indian Time (IST)' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirm = () => {
    setIsSubmitting(true);
    console.log("Submitting Payload:", {
      ...formData,
      formattedDate: formData.selectedDate.toISOString()
    });

    setTimeout(() => {
      alert(`Success! Scheduled for ${formData.selectedDate.toDateString()} at ${timeSlots.find(t => t.id === formData.timeSlotId)?.time}`);
      setIsSubmitting(false);
      navigate('/user/user-upcoming-interview');
    }, 1000);
  };

  return (
    <div className="projects-container fade-in">
      <div className="breadcrumb-nav">
        <button className="link-button" onClick={() => navigate("/user/user-dashboard")}><FiArrowLeft /> Back to Dashboard</button>
        <button className="link-button" onClick={() => navigate("/user/user-upcoming-interview")}><FiArrowLeft /> Upcoming Interviews</button>
        <span className="crumb">/ Schedule Interview</span>
      </div>

      <div className="dashboard-layout" style={{ gridTemplateColumns: '350px 1fr' }}>

        {/* LEFT COLUMN: Form Inputs */}
        <aside className="dashboard-column-side">
          <div className="form-group-float" ref={emailWrapperRef}>
            <label className="section-label">Email ID</label>
            <div className="dropdown-input-wrapper">
              <input
                type="text"
                className="std-input"
                placeholder="Enter or select email..."
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  setShowEmailOptions(true);
                  setFormData(prev => ({ ...prev, email: e.target.value }));
                }}
                onFocus={() => setShowEmailOptions(true)}
              />
              <FiChevronDown className="input-icon-right" />
              {showEmailOptions && (
                <div className="custom-dropdown-menu">
                  {emailSuggestions
                    .filter(email => email.toLowerCase().includes(emailInput.toLowerCase()))
                    .map((email, idx) => (
                      <div key={idx} className="dropdown-item" onClick={() => handleEmailSelect(email)}>{email}</div>
                    ))}
                  {emailInput && !emailSuggestions.includes(emailInput) && (
                    <div className="dropdown-item new-item" onClick={() => handleEmailSelect(emailInput)}>Use "{emailInput}"</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="table-card card-compact">
            <div className="candidate-header-row">
              <img src="https://i.pravatar.cc/150?u=michael" alt="Michael" className="avatar-lg" />
              <div>
                <h3 className="card-title lg">Michael Chen</h3>
                <p className="role-text">Senior Frontend Developer</p>
                <span className="status-tag status-progress">Remote Interview</span>
              </div>
            </div>
            <div className="contact-list">
              <div className="contact-item"><FiMail className="icon-muted" /> {formData.email || "Select email above"}</div>
              <div className="contact-item"><FiPhone className="icon-muted" /> +1 (555) 123-4567</div>
              <div className="contact-item"><FiMapPin className="icon-muted" /> Hyderabad, Telangana</div>
            </div>
            <div className="notes-wrapper">
              <label className="section-label">Interview Notes</label>
              <div className="notes-box">Technical interview for senior frontend position. Focus on React expertise.</div>
            </div>
          </div>

          <div className="table-card card-compact">
            <h4 className="section-title text-sm">Interview Details</h4>
            <div className="detail-row">
              <label className="section-label">Duration</label>
              <select name="duration" className="std-select" value={formData.duration} onChange={handleInputChange}>
                <option value="30 minutes">30 minutes</option>
                <option value="45 minutes">45 minutes</option>
                <option value="60 minutes">60 minutes</option>
              </select>
            </div>
            <div className="detail-row">
              <label className="section-label">Meeting Link</label>
              <input type="text" name="meetingLink" className="std-input link-style" value={formData.meetingLink} onChange={handleInputChange} />
            </div>
            <div className="detail-row">
              <label className="section-label">Interviewer</label>
              <div className="interviewer-select-wrapper">
                <select name="interviewerId" className="std-select-hidden" value={formData.interviewerId} onChange={handleInputChange}>
                  {interviewers.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
                <div className="interviewer-box pointer-events-none">
                  <img src={selectedInterviewer.img} alt="Avatar" className="avatar-sm" />
                  <div>
                    <div className="name-sm">{selectedInterviewer.name}</div>
                    <div className="role-xs">{selectedInterviewer.role}</div>
                  </div>
                  <FiChevronDown className="ml-auto text-muted" />
                </div>
              </div>
            </div>
            <div className="detail-row">
              <label className="section-label">Priority</label>
              <select name="priority" className="std-select" value={formData.priority} onChange={handleInputChange}>
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: Functional Calendar */}
        <main className="dashboard-column-main">
          <div className="table-card" style={{ minHeight: '600px' }}>

            {/* Calendar Header */}
            <div className="cal-header-flex">
              <div className="cal-controls">
                <h2 className="section-title">Select Date & Time</h2>
                <div className="toggle-group">
                  <button className={`toggle-pill ${view === 'Month' ? 'active' : ''}`} onClick={() => setView('Month')}>Month</button>
                  <button className={`toggle-pill ${view === 'Week' ? 'active' : ''}`} onClick={() => setView('Week')}>Week</button>
                </div>
              </div>
              <div className="cal-month-nav">
                <button className="nav-arrow" onClick={handlePrevMonth}><FiChevronLeft /></button>
                <span className="month-title">
                  <FiCalendar className="mr-2" />
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button className="nav-arrow" onClick={handleNextMonth}><FiChevronRight /></button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="custom-cal-grid">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="cal-day-head">{d}</div>
              ))}

              {calendarGrid.map((d, i) => (
                <div
                  key={i}
                  className={`cal-day-cell 
                    ${!d.day ? 'empty' : ''} 
                    ${d.day && isSameDay(formData.selectedDate, d.fullDate) ? 'selected' : ''}
                    ${d.available ? 'available' : 'disabled'}
                  `}
                  onClick={() => d.available && setFormData(prev => ({ ...prev, selectedDate: d.fullDate }))}
                >
                  {d.day && <span className="day-num">{d.day}</span>}
                  {d.available && d.slots > 0 && (
                    <span className="slots-tag">{d.slots} slots</span>
                  )}
                  {d.day && !d.available && (
                    <span className="unavailable-dot"></span>
                  )}
                </div>
              ))}
            </div>

            {/* Time Slots */}
            <h3 className="section-title mt-6">Available Time Slots</h3>
            <div className="slots-container">
              {timeSlots.map(slot => (
                <button
                  key={slot.id}
                  className={`slot-card ${formData.timeSlotId === slot.id ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, timeSlotId: slot.id }))}
                >
                  <div className="slot-time">{slot.time}</div>
                  <div className="slot-meta">{slot.label}</div>
                  <div className="slot-meta-sub">{slot.sub}</div>
                </button>
              ))}
            </div>

            {/* Confirm Section */}
            <div className="confirm-footer">
              <div className="confirm-info">
                <h4 className="confirm-title">Confirm Schedule</h4>
                <div className="confirm-row">
                  <span><FiCalendar /> {formData.selectedDate.toDateString()}</span>
                  <span><FiClock /> {timeSlots.find(t => t.id === formData.timeSlotId)?.time}</span>
                </div>
                <div className="checkbox-wrap" onClick={() => setFormData(prev => ({ ...prev, sendReminder: !prev.sendReminder }))}>
                  {formData.sendReminder ? <FiCheckSquare className="cb-icon active" /> : <FiSquare className="cb-icon" />}
                  <span>Send email reminders</span>
                </div>
              </div>

              <button className="btn-primary" onClick={handleConfirm} disabled={isSubmitting}>
                {isSubmitting ? 'Scheduling...' : 'Confirm Schedule'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ScheduleInterview;
