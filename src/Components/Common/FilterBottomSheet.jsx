import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import "./FilterBottomSheet.css";

const FilterBottomSheet = ({ isOpen, onClose, title, children }) => {
    const [isRendered, setIsRendered] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            document.body.style.overflow = "hidden";
        } else {
            const timer = setTimeout(() => {
                setIsRendered(false);
                document.body.style.overflow = "auto";
            }, 300);
            return () => {
                clearTimeout(timer);
                document.body.style.overflow = "auto";
            };
        }
    }, [isOpen]);

    if (!isRendered && !isOpen) return null;

    return (
        <div className={`bottom-sheet-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
            <div
                className={`bottom-sheet-content ${isOpen ? "slide-up" : "slide-down"}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bottom-sheet-header">
                    <h3 className="bottom-sheet-title">{title}</h3>
                    <button className="bottom-sheet-close" onClick={onClose}>
                        <FiX size={24} />
                    </button>
                </div>
                <div className="bottom-sheet-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default FilterBottomSheet;
