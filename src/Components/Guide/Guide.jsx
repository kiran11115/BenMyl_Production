import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import {
    X,
    ChevronRight,
    ChevronLeft,
    Sparkles,
    Info
} from "lucide-react";
import "./Guide.css";

const tutorialSteps = [
    {
        targetId: null, // Overview
        title: "Welcome to BenMyl Dashboard",
        description: "This interactive tour will guide you through the key features of your workspace. Let's explore how you can manage your talent and projects efficiently.",
        position: "center"
    },
    {
        targetId: "dashboard-stats-grid",
        title: "Performance Overview",
        description: "Track your active job posts, total applications, and hiring spend at a glance. Real-time metrics to keep your pulse on recruitment.",
        position: "bottom"
    },
    {
        targetId: "dashboard-projects-section",
        title: "Active Projects",
        description: "Manage your ongoing cloud migrations, app developments, and audits. Monitor progress and stay on top of upcoming deadlines.",
        position: "right"
    },
    {
        targetId: "dashboard-charts-area",
        title: "Data Visualization",
        description: "Visualize your hiring pipeline and budget allocation. Data-driven insights to optimize your recruitment strategy.",
        position: "left"
    },
    {
        targetId: "dashboard-talent-table",
        title: "Talent Pipeline",
        description: "Review profile submissions in real-time. Direct access to candidate resumes and screening status.",
        position: "top"
    },
    {
        targetId: "dashboard-interviews-list",
        title: "Upcoming Interviews",
        description: "Your daily schedule of candidate meetings and technical screenings. Never miss a critical interview.",
        position: "left"
    }
];

const Guide = forwardRef((props, ref) => {
    const [activeStep, setActiveStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [spotlightStyles, setSpotlightStyles] = useState({});
    const [tooltipStyles, setTooltipStyles] = useState({});
    const [overlayBoxes, setOverlayBoxes] = useState({
        top: {}, bottom: {}, left: {}, right: {}
    });
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeout = useRef(null);
    const requestRef = useRef();
    const tutorialRef = useRef(null);

    useImperativeHandle(ref, () => ({
        startTour: () => {
            setActiveStep(0);
            setIsVisible(true);
        }
    }));

    useEffect(() => {
        const handleUpdate = () => {
            if (isVisible) {
                updateSpotlight();
                requestRef.current = requestAnimationFrame(handleUpdate);
            }
        };

        const handleScrollStatus = () => {
            setIsScrolling(true);
            clearTimeout(scrollTimeout.current);
            scrollTimeout.current = setTimeout(() => {
                setIsScrolling(false);
            }, 200);
        };

        if (isVisible) {
            requestRef.current = requestAnimationFrame(handleUpdate);
            window.addEventListener('scroll', handleScrollStatus, { passive: true });
            window.addEventListener('resize', updateSpotlight, { passive: true });
        }

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
            window.removeEventListener('scroll', handleScrollStatus);
            window.removeEventListener('resize', updateSpotlight);
        };
    }, [activeStep, isVisible]);

    const updateSpotlight = () => {
        const step = tutorialSteps[activeStep];
        if (!step.targetId) {
            setSpotlightStyles({ opacity: 0, pointerEvents: 'none' });
            setOverlayBoxes({
                top: { transform: 'translate3d(0, 0, 0)', width: '100%', height: '100%' },
                bottom: { display: 'none' },
                left: { display: 'none' },
                right: { display: 'none' }
            });
            setTooltipStyles({
                transform: 'translate3d(-50%, -50%, 0)',
                top: '50%',
                left: '50%',
                zIndex: 10001
            });
            return;
        }

        const element = document.getElementById(step.targetId);
        if (element) {
            const rect = element.getBoundingClientRect();
            const styles = window.getComputedStyle(element);
            const borderRadius = styles.borderRadius;
            const padding = 10;

            const x1 = rect.left - padding;
            const y1 = rect.top - padding;
            const x2 = rect.right + padding;
            const y2 = rect.bottom + padding;

            setSpotlightStyles({
                transform: `translate3d(${x1}px, ${y1}px, 0)`,
                width: rect.width + padding * 2,
                height: rect.height + padding * 2,
                opacity: 1,
                borderRadius: borderRadius !== '0px' ? `calc(${borderRadius} + ${padding}px)` : '12px'
            });

            // 4-Box Overlay Logic
            setOverlayBoxes({
                top: { transform: 'translate3d(0, 0, 0)', width: '100%', height: y1 },
                bottom: { transform: `translate3d(0, ${y2}px, 0)`, width: '100%', height: `calc(100% - ${y2}px)` },
                left: { transform: `translate3d(0, ${y1}px, 0)`, width: x1, height: y2 - y1 },
                right: { transform: `translate3d(${x2}px, ${y1}px, 0)`, width: `calc(100% - ${x2}px)`, height: y2 - y1 }
            });

            // Tooltip Positioning logic
            let tX = rect.left + (rect.width / 2) - 170;
            let tY = rect.bottom + 20;

            if (step.position === 'top') {
                tY = rect.top - 200;
            } else if (step.position === 'left') {
                tY = rect.top;
                tX = rect.left - 360;
            } else if (step.position === 'right') {
                tY = rect.top;
                tX = rect.right + 20;
            }

            setTooltipStyles({
                transform: `translate3d(${tX}px, ${tY}px, 0)`,
                zIndex: 10001
            });

            if (!isScrolling) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    if (!isVisible) return null;

    const currentStep = tutorialSteps[activeStep];

    return (
        <div className={`tutorial-tour-container ${isScrolling ? 'is-scrolling' : ''}`} ref={tutorialRef}>
            {/* Overlay Background Sections */}
            <div className="tutorial-overlay" style={overlayBoxes.top} onClick={() => setIsVisible(false)}></div>
            <div className="tutorial-overlay" style={overlayBoxes.bottom} onClick={() => setIsVisible(false)}></div>
            <div className="tutorial-overlay" style={overlayBoxes.left} onClick={() => setIsVisible(false)}></div>
            <div className="tutorial-overlay" style={overlayBoxes.right} onClick={() => setIsVisible(false)}></div>

            {/* Spotlight Circle/Rect */}
            <div className="tutorial-spotlight" style={spotlightStyles}></div>

            {/* Floating Tooltip Card */}
            <div className="tutorial-tooltip-card" style={tooltipStyles}>
                <div className="tutorial-card-header">
                    <div className="tutorial-badge">
                        <Sparkles size={14} /> Step {activeStep + 1} of {tutorialSteps.length}
                    </div>
                    <button className="tutorial-close" onClick={() => setIsVisible(false)}>
                        <X size={16} />
                    </button>
                </div>

                <div className="tutorial-card-body">
                    <h3 className="tutorial-card-title">{currentStep.title}</h3>
                    <p className="tutorial-card-description">{currentStep.description}</p>
                </div>

                <div className="tutorial-card-footer">
                    <div className="tutorial-progress-dots">
                        {tutorialSteps.map((_, i) => (
                            <div key={i} className={`tutorial-dot ${i === activeStep ? 'active' : ''}`}></div>
                        ))}
                    </div>
                    <div className="tutorial-actions">
                        <button
                            className="tutorial-btn secondary"
                            onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                            disabled={activeStep === 0}
                        >
                            <ChevronLeft size={16} /> Back
                        </button>
                        <button
                            className="tutorial-btn primary"
                            onClick={() => {
                                if (activeStep < tutorialSteps.length - 1) {
                                    setActiveStep(prev => prev + 1);
                                } else {
                                    setIsVisible(false);
                                }
                            }}
                        >
                            {activeStep === tutorialSteps.length - 1 ? "Finish" : "Next"} <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Guide;
