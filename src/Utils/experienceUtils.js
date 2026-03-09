/**
 * Calculates total work experience from an array of work experience objects.
 * Returns only total years (months are ignored).
 *
 * @param {Array} workExperiences - Array of objects with startDate and endDate
 * @returns {string} - Formatted experience string (e.g., "5 yrs")
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

    const years = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;
    const suffix = remainingMonths > 0 ? "+" : "";

    return `${years}${suffix} yr${years !== 1 ? "s" : ""}`;
};
