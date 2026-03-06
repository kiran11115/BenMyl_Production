/**
 * Calculates total work experience from an array of work experience objects.
 * 
 * @param {Array} workExperiences - Array of objects with startDate and endDate
 * @returns {string} - Formatted experience string (e.g., "5 yrs 3 mos" or "N/A")
 */
export const calculateTotalExperience = (workExperiences) => {
    if (!workExperiences || workExperiences.length === 0) return "0 yrs";

    let totalMonths = 0;

    workExperiences.forEach((exp) => {
        const start = exp.startDate ? new Date(exp.startDate) : null;
        const end = exp.endDate ? new Date(exp.endDate) : new Date();

        if (start && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
            const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
            totalMonths += Math.max(0, months);
        }
    });

    if (totalMonths === 0) return "0 yrs";

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    let result = "";
    if (years > 0) result += `${years} yr${years > 1 ? "s" : ""}`;
    if (months > 0) {
        if (result) result += " ";
        result += `${months} mo${months > 1 ? "s" : ""}`;
    }

    return result || "0 yrs";
};
