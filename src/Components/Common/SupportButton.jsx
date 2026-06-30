import React, { useState, useRef, useEffect } from "react";
import { FiX, FiRefreshCw, FiMessageCircle, FiSend } from "react-icons/fi";
import "./SupportButton.css";
import { useGetFAQsQuery } from "../../State-Management/Api/ChatApiSlice";

// const FAQ_TREE = [
//   {
//     id: "getting_started",
//     question: "How do I get started?",
//     answer:
//       "Welcome! Navigate to the Dashboard from the top menu. From there you can post jobs, upload talent, and manage interviews all in one place.",
//     followups: [
//       {
//         id: "post_job",
//         question: "How do I post a job?",
//         answer:
//           "Go to Projects → Post New Position. Fill in the job title, required skills, experience range, and salary range, then click Submit. Your new position will appear in the Job Management module.",
//       },
//       {
//         id: "upload_talent",
//         question: "How do I upload talent?",
//         answer:
//           "Navigate to Talent Pool → Upload Talent. You can bulk upload CVs and our AI parser will extract all candidate details automatically. Review the parsed profiles before saving.",
//       },
//     ],
//   },
//   {
//     id: "talentpool",
//     question: "How does the Talent Pool work?",
//     answer:
//       "The Talent Pool is your central hub for managing candidates. You can browse, filter, shortlist, and invite candidates to apply for specific job openings.",
//     followups: [
//       {
//         id: "shortlist",
//         question: "How do I shortlist candidates?",
//         answer:
//           "Click the bookmark icon on any candidate card to shortlist them for a specific job. Open the Shortlist drawer to review all shortlisted candidates and send bulk invites.",
//       },
//       {
//         id: "filters",
//         question: "How do filters work?",
//         answer:
//           "Filters apply instantly as you select them- no need to click 'Apply'. Use the sidebar filters to narrow down by job title, skills, location, salary range, experience, and availability.",
//       },
//       {
//         id: "invite",
//         question: "How do I send an invite?",
//         answer:
//           "Shortlist candidates for a job, then open the Shortlist drawer and click 'Send Invite'. All shortlisted candidates for that job will receive a notification email automatically.",
//       },
//     ],
//   },
//   {
//     id: "interviews",
//     question: "How do I schedule an interview?",
//     answer:
//       "Go to Interviews → Upcoming Interviews. Click 'Schedule Interview', select the job, candidate, date, time, and interviewers, then send the invite. The candidate receives a calendar invite automatically.",
//     followups: [
//       {
//         id: "reschedule",
//         question: "Can I reschedule an interview?",
//         answer:
//           "Yes. On the Upcoming Interviews page, find the interview and click the Edit icon. Update the time/date and save. All participants will receive an updated notification.",
//       },
//       {
//         id: "cancel_int",
//         question: "How do I cancel an interview?",
//         answer:
//           "Click the Cancel icon on the interview card. Confirm the cancellation and a notification will be sent to all participants.",
//       },
//     ],
//   },
//   {
//     id: "contracts",
//     question: "How do I manage contracts?",
//     answer:
//       "The Contracts module lets you create, send, and track contracts with candidates. Navigate to Contracts from the top menu to view all active and completed contracts.",
//     followups: [
//       {
//         id: "create_contract",
//         question: "How do I create a contract?",
//         answer:
//           "Go to Contracts → Create Contract. Fill in the candidate details, start/end date, rate, and terms. Click Submit to generate the contract and send it for e-signature.",
//       },
//       {
//         id: "track_contract",
//         question: "How do I track contract status?",
//         answer:
//           "The Contract Listing page shows status badges: Draft, Sent, Signed, or Expired. Click any contract to view full details and history.",
//       },
//     ],
//   },
//   {
//     id: "account",
//     question: "How do I manage my account?",
//     answer:
//       "Click your profile avatar in the top-right corner to open your profile panel. From there you can edit your profile, change settings, or sign out.",
//     followups: [
//       {
//         id: "edit_profile",
//         question: "How do I edit my profile?",
//         answer:
//           "Click your profile avatar → Edit Profile. Update your name, photo, contact info, and bio. Changes are saved immediately upon clicking Save.",
//       },
//       {
//         id: "permissions",
//         question: "How do I manage team permissions?",
//         answer:
//           "Admin users can manage role-based permissions via Admin → Control Center → Role Configuration. You can assign and revoke module access for each team member.",
//       },
//     ],
//   },
//   {
//     id: "contact",
//     question: "I need more help",
//     answer:
//       "We're here to help! Reach our support team through the channels below and we'll get back to you within one business day.",
//     followups: [
//       {
//         id: "email_support",
//         question: "Email support",
//         answer:
//           "Send your query to support@benmyl.com. Include your account email and a description of the issue for fastest resolution.",
//       },
//       {
//         id: "phone_support",
//         question: "Call us",
//         answer:
//           "Our support line is available Monday–Friday, 9 AM–6 PM EST. Call us at +1 (800) 555-0199 for urgent issues.",
//       },
//     ],
//   },
// ];

const BOT_INTRO =
  "Hi there! I'm the BenMyl Support Assistant. Select a topic below or type your question- I'm here to help!";

export default function SupportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [anyModalOpen, setAnyModalOpen] = useState(false);
  const { data: faqResponse, isLoading } = useGetFAQsQuery(undefined,{refetchOnMountOrArgChange:true});

const faqData = faqResponse?.data || [];

const faqOptions = faqData.map((item) => ({
  id: item.faqid,
  label: item.userQuestion,
}));
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-hide FAB when any modal/overlay is present in the DOM
  useEffect(() => {
    const OVERLAY_SELECTORS = [
      ".sid-overlay",
      ".drawer-overlay",
      ".custom-modal-overlay",
      ".routine-modal-overlay",
    ];

    const checkOverlays = () => {
      const found = OVERLAY_SELECTORS.some(
        (sel) => document.querySelector(sel) !== null
      );
      setAnyModalOpen(found);
    };

    const observer = new MutationObserver(checkOverlays);
    observer.observe(document.body, { childList: true, subtree: true });
    checkOverlays(); // initial check

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  useEffect(() => {
  if (faqOptions.length > 0) {
    setMessages([
      { type: "bot", text: BOT_INTRO },
      {
        type: "options",
        options: faqOptions,
      },
    ]);
  }
}, [faqResponse]);

  const handleOpen = () => {
    setIsClosing(false);
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 350);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const handleReset = () => {
  setMessages([
    { type: "bot", text: BOT_INTRO },
    {
      type: "options",
      options: faqOptions,
    },
  ]);

  setInputVal("");
};

  const handleOptionClick = (optionId) => {
  const faqItem = faqData.find(
    (item) => item.faqid === optionId
  );

  if (!faqItem) return;

  setMessages((prev) => [
    ...prev,
    {
      type: "user",
      text: faqItem.userQuestion,
    },
    {
      type: "bot",
      text: faqItem.quickReply,
    },
    {
      type: "options",
      options: [
        {
          id: "__back",
          label: "← Back to all topics",
        },
      ],
      prefix: "Need anything else?",
    },
  ]);
};

  const handleSpecialOption = (optionId) => {
    if (optionId === "__back") {
      handleReset();
    } else if (optionId === "__done") {
      setMessages([
        ...messages,
        { type: "user", text: "Thanks, that helped!" },
        {
          type: "bot",
          text: "Great! If you ever need help again, just open this chat. Have a productive day! 🚀",
        },
      ]);
    }
  };

 const handleOptionSelect = (id) => {
  if (
    typeof id === "string" &&
    id.startsWith("__")
  ) {
    handleSpecialOption(id);
  } else {
    handleOptionClick(id);
  }
};

 const handleInputSend = () => {
  const text = inputVal.trim();

  if (!text) return;

  const matchedFaq = faqData.find(
    (faq) =>
      faq.userQuestion
        ?.toLowerCase()
        .includes(text.toLowerCase()) ||
      text
        .toLowerCase()
        .includes(faq.userQuestion?.toLowerCase())
  );

  const newMessages = [
    ...messages,
    { type: "user", text },
  ];

  if (matchedFaq) {
    newMessages.push({
      type: "bot",
      text: matchedFaq.quickReply,
    });

    newMessages.push({
      type: "options",
      options: [
        {
          id: "__back",
          label: "← Back to all topics",
        },
      ],
    });
  } else {
    newMessages.push({
      type: "bot",
      text: "I couldn't find a specific answer to that. Here are some topics I can help with:",
    });

    newMessages.push({
      type: "options",
      options: faqOptions,
    });
  }

  setMessages(newMessages);
  setInputVal("");
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleInputSend();
  };

  return (
    <>
      {/* FAB — hides when support drawer OR any other modal is open */}
      <button
        className={`support-fab ${isOpen || isClosing || anyModalOpen ? "hidden" : ""}`}
        onClick={handleOpen}
        aria-label="Open Support"
        id="support-fab-btn"
      >
        <span className="support-fab-icon-wrap">
          <FiMessageCircle size={18} />
        </span>
        <span className="support-fab-pulse" />
      </button>

      {/* - Side Drawer (overlay wraps panel- flex:end pushes it right) - */}
      {(isOpen || isClosing) && (
        <div
          className={`sid-overlay ${isClosing ? "closing" : ""}`}
          onClick={handleClose}
        >
          <div
            className={`support-sid-container sid-container ${isOpen && !isClosing ? "open" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sid-header">
              <h2 className="sid-header-title">
                <FiMessageCircle size={16} color="rgba(255,255,255,0.85)" />
                BenMyl Support
                <span className="support-online-badge">
                  <span className="support-online-dot" />
                  Online
                </span>
              </h2>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="sid-close-btn"
                  onClick={handleReset}
                  title="Restart conversation"
                >
                  <FiRefreshCw size={14} />
                </button>
                <button className="sid-close-btn" onClick={handleClose} title="Close">
                  <FiX size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="support-messages hide-scrollbar">
              {messages.map((msg, idx) => {
                if (msg.type === "bot") {
                  return (
                    <div key={idx} className="support-msg-row bot">
                      <div className="support-bot-avatar">B</div>
                      <div className="support-bubble bot">{msg.text}</div>
                    </div>
                  );
                }
                if (msg.type === "user") {
                  return (
                    <div key={idx} className="support-msg-row user">
                      <div className="support-bubble user">{msg.text}</div>
                    </div>
                  );
                }
                if (msg.type === "options") {
                  return (
                    <div key={idx} className="support-options-group">
                      {msg.prefix && (
                        <div className="support-options-prefix">{msg.prefix}</div>
                      )}
                      {msg.options.map((opt) => (
                        <button
                          key={opt.id}
                          className="support-option-chip"
                          onClick={() => handleOptionSelect(opt.id)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  );
                }
                return null;
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="support-input-row">
              <input
                ref={inputRef}
                className="support-input"
                type="text"
                placeholder="Type your question..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                id="support-chat-input"
              />
              <button
                className="support-send-btn"
                onClick={handleInputSend}
                disabled={!inputVal.trim()}
                id="support-send-btn"
              >
                <FiSend size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
