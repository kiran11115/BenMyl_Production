import React, { useState } from "react";
import "./Header.css";

function NotificationsPage() {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            author: "Daniel Thompson",
            action: "commented on the course",
            message:
                "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
            time: "Today at 11:45 AM",
            avatar: "https://i.pravatar.cc/150?img=12",
            read: false,
        },
        {
            id: 2,
            author: "Daniel Thompson",
            action: "replied to your comment",
            message:
                "The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
            time: "Today at 11:45 AM",
            avatar: "https://i.pravatar.cc/150?img=15",
            read: false,
        },
        {
            id: 3,
            author: "Daniel Thompson",
            action: "commented on the course",
            message:
                "It is a long established fact that a reader will be distracted by the readable content.",
            time: "Today at 11:45 AM",
            avatar: "https://i.pravatar.cc/150?img=18",
            read: true,
        },
        {
            id: 4,
            author: "Sophia Martinez",
            action: "liked your comment",
            message:
                "Sophia liked your thoughts on the lesson about creative confidence.",
            time: "Today at 10:12 AM",
            avatar: "https://i.pravatar.cc/150?img=32",
            read: false,
        },
        {
            id: 5,
            author: "Michael Johnson",
            action: "replied to your discussion",
            message:
                "I completely agree with your point. Consistency is the key to learning.",
            time: "Yesterday at 9:30 PM",
            avatar: "https://i.pravatar.cc/150?img=45",
            read: true,
        },
        {
            id: 6,
            author: "Emily Davis",
            action: "mentioned you in a comment",
            message:
                "@you This part of the course really helped me overcome anxiety.",
            time: "Yesterday at 6:15 PM",
            avatar: "https://i.pravatar.cc/150?img=25",
            read: true,
        },
        {
            id: 7,
            author: "James Wilson",
            action: "started following you",
            message:
                "James Wilson is now following your learning journey.",
            time: "Yesterday at 4:50 PM",
            avatar: "https://i.pravatar.cc/150?img=55",
            read: true,
        },
        {
            id: 8,
            author: "Olivia Brown",
            action: "commented on your post",
            message:
                "Great insights! I especially liked the example you shared.",
            time: "2 days ago",
            avatar: "https://i.pravatar.cc/150?img=60",
            read: true,
        },
        {
            id: 9,
            author: "Ethan Clark",
            action: "shared your post",
            message:
                "Ethan shared your post with his followers.",
            time: "2 days ago",
            avatar: "https://i.pravatar.cc/150?img=64",
            read: true,
        },
        {
            id: 10,
            author: "Isabella Moore",
            action: "replied to your question",
            message:
                "You can practice this technique daily to see faster improvement.",
            time: "3 days ago",
            avatar: "https://i.pravatar.cc/150?img=48",
            read: true,
        },
    ]);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const newNotifications = notifications.filter(n => !n.read);
    const earlyNotifications = notifications.filter(n => n.read);

    return (
        <div className="container" style={{ padding: "20px 0" }}>
            <div className="container-notification">

                {/* 🔒 STICKY HEADER */}
                <div className="notifications-header">
                    <h2>Notifications</h2>
                    <div className="header-actions">
                        <button onClick={markAllRead}>Mark as read</button>
                        {/* <button onClick={clearAll} className="clear-btn">
              Clear all
            </button> */}
                        <button className="clear-btn">
                            Clear all
                        </button>
                    </div>
                </div>

                {/* 📜 SCROLLABLE CONTENT */}
                <div className="notifications-scroll">
                    {newNotifications.length > 0 && (
                        <>
                            <div className="section-title">
                                New {newNotifications.length}
                            </div>
                            {newNotifications.map(item => (
                                <div key={item.id} className="notification-item unread">
                                    <img src={item.avatar} alt="" className="avatar" />
                                    <div className="notification-content">
                                        <div className="title">
                                            <strong>{item.author}</strong>{" "}
                                            <span>{item.action}</span>
                                        </div>
                                        <div className="message">{item.message}</div>
                                        <div className="time">{item.time}</div>
                                    </div>
                                    <span className="blue-dot" />
                                </div>
                            ))}
                        </>
                    )}

                    {earlyNotifications.length > 0 && (
                        <>
                            <div className="section-title">Early</div>
                            {earlyNotifications.map(item => (
                                <div key={item.id} className="notification-item">
                                    <img src={item.avatar} alt="" className="avatar" />
                                    <div className="notification-content">
                                        <div className="title">
                                            <strong>{item.author}</strong>{" "}
                                            <span>{item.action}</span>
                                        </div>
                                        <div className="message">{item.message}</div>
                                        <div className="time">{item.time}</div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}

export default NotificationsPage;
