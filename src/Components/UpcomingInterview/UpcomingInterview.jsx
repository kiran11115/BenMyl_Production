import React, { useState } from "react";
import {
    FiChevronLeft,
    FiCalendar,
    FiClock,
    FiPlus,
    FiVideo,
    FiRepeat,
    FiArrowLeft,
    FiChevronLeft as FiBack,
} from "react-icons/fi";
import "./UpcomingInterview.css";
import { useNavigate } from "react-router-dom";

const MOCK = [
    {
        id: 1,
        dateLabel: "Dec 15, 2023",
        time: "10:00 AM",
        name: "Sarah Anderson",
        role: "Senior Frontend Developer",
        tag: "Technical Round",
        interviewer: { name: "Michael Chen", avatar: "https://i.pravatar.cc/40?img=32" },
    },
    {
        id: 2,
        dateLabel: "Dec 15, 2023",
        time: "2:30 PM",
        name: "David Wilson",
        role: "Product Manager",
        tag: "First Interview",
        interviewer: { name: "Emily Rodriguez", avatar: "https://i.pravatar.cc/40?img=12" },
    },
    {
        id: 3,
        dateLabel: "Dec 16, 2023",
        time: "11:00 AM",
        name: "James Thompson",
        role: "UX Designer",
        tag: "Design Challenge",
        interviewer: { name: "Alex Kim", avatar: "https://i.pravatar.cc/40?img=5" },
    },
    // duplicate rows to show layout
    { id: 4, dateLabel: "Dec 15, 2023", time: "10:00 AM", name: "Sarah Anderson", role: "Senior Frontend Developer", tag: "Technical Round", interviewer: { name: "Michael Chen", avatar: "https://i.pravatar.cc/40?img=32" }, },
    { id: 5, dateLabel: "Dec 15, 2023", time: "2:30 PM", name: "David Wilson", role: "Product Manager", tag: "First Interview", interviewer: { name: "Emily Rodriguez", avatar: "https://i.pravatar.cc/40?img=12" }, },
    { id: 6, dateLabel: "Dec 16, 2023", time: "11:00 AM", name: "James Thompson", role: "UX Designer", tag: "Design Challenge", interviewer: { name: "Alex Kim", avatar: "https://i.pravatar.cc/40?img=5" }, },
];

export default function UpcomingInterview() {
    const navigate = useNavigate();
    const [view, setView] = useState("Month"); // Month | Week
    const [selectedMonth] = useState("March 2025");

    return (
        <div className="ui-page">
            <div className="ui-breadcrumbs">
                <button className="link-button" onClick={() => navigate("/user/user-dashboard")}><FiArrowLeft /> Back to Dashboard</button>
                <span className="crumb">/ Upcoming Interviews</span>
            </div>

            <div className="ui-header">
                <div>
                    <h1 className="ui-title">Upcoming Interviews</h1>
                    <p className="ui-sub">Enter all necessary details to generate a new contract record</p>
                </div>

                <div className="ui-actions">
                    <div className="view-toggle1">
                        <button className={`toggle ${view === "Month" ? "active" : ""}`} onClick={() => setView("Month")}>Month</button>
                        <button className={`toggle ${view === "Week" ? "active" : ""}`} onClick={() => setView("Week")}>Week</button>
                    </div>

                    <div className="month-label">
                        <FiCalendar /> <span>{selectedMonth}</span>
                    </div>

                    <button className="add-project-btn" onClick={() => navigate("/user/user-schedule-interview")}><FiPlus /> Add New Interview</button>
                </div>
            </div>

            <div className="projects-grid">
                {MOCK.map((it) => (
                    <article className="project-card" key={it.id}>
                        <div className="card-top">
                            <div className="card-date"><FiCalendar className="ico1" /> {it.dateLabel}</div>
                            <div className="card-time"><FiClock className="ico1" /> {it.time}</div>
                        </div>

                        <div className="card-body">
                            <div className="status-tag status-progress d-flex justify-content-center">{it.tag}</div>
                            <h3 className="candidate-name mt-3">{it.name}</h3>
                            <div className="candidate-role">{it.role}</div>
     

                            <div className="interviewer-row">
                                <img className="int-avatar" src={it.interviewer.avatar} alt={it.interviewer.name} />
                                <div className="int-info">
                                    <div className="int-label">Interviewer</div>
                                    <div className="int-name">{it.interviewer.name}</div>
                                </div>
                            </div>

                            <div className="card-actions">
                                <button className="btn-primary gap-2"><FiVideo /> Join Meeting</button>
                                <button className="btn-secondary gap-2"><FiRepeat /> Reschedule</button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
