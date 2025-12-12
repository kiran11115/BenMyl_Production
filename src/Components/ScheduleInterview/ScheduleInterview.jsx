import React, { useMemo, useState } from "react";
import {
    FiChevronLeft,
    FiChevronRight,
    FiMail,
    FiPhone,
    FiMapPin,
    FiClock,
    FiCalendar,
    FiCheck,
    FiArrowLeft,
} from "react-icons/fi";
import "./ScheduleInterview.css";
import { useNavigate } from "react-router-dom";

/**
 * Custom calendar implementation (no external calendar library).
 * Usage: import and render <ScheduleInterview /> in your route.
 */

const PROFILE = {
    name: "Michael Chen",
    role: "Senior Frontend Developer",
    photo: "https://i.pravatar.cc/96?img=65",
    email: "michael.chen@email.com",
    phone: "+1 (555) 123-4567",
    location: "Hyderabad, Telangana",
    notes:
        "Technical interview for senior frontend position. Focus on React expertise and system design experience.",
    duration: "45 minutes",
    meetingLink: "https://meet.company.com/interview-123",
    interviewer: { name: "David Kim", title: "Technical Lead", avatar: "https://i.pravatar.cc/40?img=12" },
    priority: "Medium Priority",
};

// example: available slots mapping (monthIndex -> day -> slots)
const EXAMPLE_SLOTS = {
    // month index (0 = Jan). We'll use current month in state below
    // For demo: mark the 15th as 3 slots.
};

function generateMonthDays(year, month) {
    // returns array of weeks, each week is array of Date or null for empty cells (Sun-Sat)
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const weeks = [];
    let week = new Array(7).fill(null);

    // fill leading blanks
    let dayOfWeek = first.getDay(); // 0 - Sun
    for (let i = 0; i < dayOfWeek; i++) week[i] = null;

    for (let d = 1; d <= last.getDate(); d++) {
        const date = new Date(year, month, d);
        const dow = date.getDay();
        week[dow] = date;
        if (dow === 6 || d === last.getDate()) {
            // push week and reset
            weeks.push(week);
            week = new Array(7).fill(null);
        }
    }
    return weeks;
}

export default function ScheduleInterview() {
    const navigate = useNavigate();
    const today = new Date();
    const [view, setView] = useState("Month"); // Month | Week (week is minimal here)
    const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    // for demo we add a few available slots for day 15
    const [availableSlotsMap] = useState(() => {
        const m = {};
        const key = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`;
        m[key] = { 15: ["09:00 AM - 09:45 AM", "10:00 AM - 10:45 AM", "02:00 PM - 02:45 PM"] };
        return m;
    });

    const weeks = useMemo(
        () => generateMonthDays(currentMonth.getFullYear(), currentMonth.getMonth()),
        [currentMonth]
    );

    const [selectedDate, setSelectedDate] = useState(() => {
        // default: 15 if in same month else first available
        const day = 15;
        const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        return d;
    });

    const slotsForSelected = useMemo(() => {
        const key = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`;
        const map = availableSlotsMap[key] || {};
        const day = selectedDate ? selectedDate.getDate() : null;
        return day && map[day] ? map[day] : [];
    }, [availableSlotsMap, currentMonth, selectedDate]);

    const [selectedSlot, setSelectedSlot] = useState(slotsForSelected[0] || null);
    const [sendReminders, setSendReminders] = useState(true);

    // navigation
    const gotoPrevMonth = () => {
        setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
    };
    const gotoNextMonth = () => {
        setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
    };

    // when month changes, update selectedDate to 15th of new month by default
    React.useEffect(() => {
        const defaultDay = 15;
        const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), defaultDay);
        setSelectedDate(d);
    }, [currentMonth]);

    // when available slots change for selected date, pick first slot
    React.useEffect(() => {
        setSelectedSlot(slotsForSelected[0] || null);
    }, [slotsForSelected]);

    const onConfirm = () => {
        if (!selectedSlot || !selectedDate) {
            alert("Please select a date and timeslot.");
            return;
        }
        const formatted = `${selectedDate.toDateString()} • ${selectedSlot}`;
        alert(`Scheduled: ${formatted}\nReminders: ${sendReminders ? "Yes" : "No"}`);
        // integrate your API call here
    };

    const monthLabel = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

    // helper: format day number
    const getDay = (d) => (d instanceof Date ? d.getDate() : "");

    return (
        <div className="si-page">
            <div className="si-breadcrumbs">
                <button className="link-button" onClick={() => navigate("/user/user-dashboard")}><FiArrowLeft /> Back to Dashboard</button>
                <button className="link-button" onClick={() => navigate("/user/user-upcoming-interview")}><FiArrowLeft /> Upcoming Interviews</button>
                <span className="crumb">/ Schedule Interviews</span>
            </div>

            <div className="si-top">
                <div className="email-input">
                    <label className="fw-semibold">Email ID</label>
                    <input placeholder="Enter Email ID for Interview" />
                </div>

                <div className="si-controls">
                    <div className="view-toggle1">
                        <div className={`pill ${view === "Month" ? "active" : ""}`} onClick={() => setView("Month")}>Month</div>
                        <div className={`pill ${view === "Week" ? "active" : ""}`} onClick={() => setView("Week")}>Week</div>
                    </div>
                    <div className="month-nav">
                        <button onClick={gotoPrevMonth} className="nav-btn"><FiChevronLeft /></button>
                        <div className="month-label">{monthLabel}</div>
                        <button onClick={gotoNextMonth} className="nav-btn"><FiChevronRight /></button>
                    </div>
                </div>
            </div>

            <div className="si-grid">
                {/* LEFT col: profile + details */}
                <aside className="si-left">
                    <div className="profile-card">
                        <div className="profile-top">
                            <img src={PROFILE.photo} alt={PROFILE.name} className="profile-photo" />
                            <div className="profile-info">
                                <div className="p-name">{PROFILE.name}</div>
                                <div className="p-role">{PROFILE.role}</div>
                                <div className="p-badge">Remote Interview</div>
                            </div>
                        </div>

                        <div className="profile-contact">
                            <div className="contact-row"><FiMail className="ico1" /> {PROFILE.email}</div>
                            <div className="contact-row"><FiPhone className="ico1" /> {PROFILE.phone}</div>
                            <div className="contact-row"><FiMapPin className="ico1" /> {PROFILE.location}</div>
                        </div>

                        <div className="profile-notes">
                            <div className="notes-title">Interview Notes</div>
                            <div className="notes-body">{PROFILE.notes}</div>
                        </div>
                    </div>

                    <div className="details-card">
                        <h4>Interview Details</h4>
                        <label>Duration</label>
                        <input value={PROFILE.duration} readOnly />

                        <label>Meeting Link</label>
                        <input value={PROFILE.meetingLink} readOnly />

                        <label>Interviewer</label>
                        <div className="interviewer-item">
                            <img src={PROFILE.interviewer.avatar} alt="int" />
                            <div>
                                <div className="int-name">{PROFILE.interviewer.name}</div>
                                <div className="int-title">{PROFILE.interviewer.title}</div>
                            </div>
                        </div>

                        <label>Priority</label>
                        <div className="priority">
                            <span className="dot medium" /> {PROFILE.priority}
                        </div>
                    </div>
                </aside>

                {/* RIGHT col: calendar + slots + confirm */}
                <main className="si-right">
                    <div className="calendar-card">
                        {/* Calendar header is above but we show a grid */}
                        {view === "Month" ? (
                            <div className="calendar-grid">
                                <div className="week-days">
                                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="wd">{d}</div>)}
                                </div>

                                <div className="weeks">
                                    {weeks.map((week, wi) => (
                                        <div className="week-row" key={wi}>
                                            {week.map((cell, ci) => {
                                                const isToday = cell && cell.toDateString() === new Date().toDateString();
                                                const isSelected = cell && selectedDate && cell.toDateString() === selectedDate.toDateString();
                                                const key = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`;
                                                const map = availableSlotsMap[key] || {};
                                                const day = cell ? cell.getDate() : null;
                                                const slots = day && map[day] ? map[day] : [];
                                                return (
                                                    <div
                                                        key={ci}
                                                        className={`cal-cell ${cell ? "" : "empty"} ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}`}
                                                        onClick={() => cell && setSelectedDate(cell)}
                                                    >
                                                        {cell ? (
                                                            <>
                                                                <div className="cell-top">
                                                                    <div className="cell-day">{getDay(cell)}</div>
                                                                </div>
                                                                <div className="cell-bottom">
                                                                    {slots.length > 0 && <div className="slots-pill">{slots.length} slots available</div>}
                                                                </div>
                                                            </>
                                                        ) : null}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="calendar-week-view">
                                {/* Basic week header */}
                                <div className="week-row-header">
                                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="wd-mini">{d}</div>)}
                                </div>
                                <div className="week-row-cells">
                                    {Array.from({ length: 7 }).map((_, i) => <div key={i} className="wd-cell">—</div>)}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Available time slots */}
                    <div className="slots-section">
                        <h4>Available Time Slots</h4>
                        <div className="slots-list">
                            {slotsForSelected.length > 0 ? slotsForSelected.map((s, idx) => (
                                <button
                                    key={s}
                                    className={`slot-card ${selectedSlot === s ? "active" : ""}`}
                                    onClick={() => setSelectedSlot(s)}
                                >
                                    <div className="slot-time">{s}</div>
                                    <div className="slot-meta">{selectedDate?.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</div>
                                </button>
                            )) : (
                                <div className="no-slots">No slots available for selected date.</div>
                            )}
                        </div>
                    </div>

                    {/* Confirm schedule */}
                    <div className="confirm-card">
                        <h4>Confirm Schedule</h4>
                        <div className="confirm-row">
                            <FiCalendar className="ico" />
                            <div>
                                <div className="confirm-date">{selectedDate?.toDateString() ?? "No date selected"}</div>
                                <div className="confirm-time">{selectedSlot ?? "No timeslot selected"}</div>
                            </div>
                        </div>

                        <label className="confirm-checkbox">
                            <input type="checkbox" checked={sendReminders} onChange={() => setSendReminders((s) => !s)} />
                            Send email reminders
                        </label>

                        <div className="confirm-notes">Rescheduling is allowed up to 24 hours before the interview</div>

                        <div className="confirm-actions">
                            <button className="btn confirm" onClick={onConfirm}><FiCheck /> Confirm Schedule</button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
