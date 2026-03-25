/**
 * Guide Data for BenMyl Dashboard
 */

// Embed parameters:
// rel=0: No related videos from other channels
// modestbranding=1: Minimal YouTube branding
// autoplay=1: Start immediately
// iv_load_policy=3: Hide annotations
// mute=0: Try to play with sound (usually works if user clicked to open popover)

const embedParams = "rel=0&modestbranding=1&autoplay=1&mute=0&iv_load_policy=3&controls=1&disablekb=1";

export const videoGuides = [
    {
        id: "guide-1",
        title: "Streamlined Hiring Workflow",
        url: "https://youtu.be/gujfOe46-44",
        embedUrl: `https://www.youtube.com/embed/gujfOe46-44?${embedParams}`
    },
    {
        id: "guide-2",
        title: "Talent-to-Opportunity Workflow",
        url: "https://youtu.be/oQp7BYarXBw",
        embedUrl: `https://www.youtube.com/embed/oQp7BYarXBw?${embedParams}`
    }
];

/* 
// FUTURE GUIDE DATA
export const extraGuides = [
    {
        id: 3,
        title: "Managing Profiles",
        url: "https://example.com/guide/profiles",
        type: "link"
    }
];
*/
