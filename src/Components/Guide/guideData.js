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
        title: "Post a Job Flow",
        url: "https://youtu.be/74dWHt7A7MU",
        embedUrl: `https://www.youtube.com/embed/74dWHt7A7MU?${embedParams}`,
        section: "Main Flows"
    },
    {
        id: "guide-2",
        title: "Upload Talent Flow",
        url: "https://youtu.be/MileJSIIy3k",
        embedUrl: `https://www.youtube.com/embed/MileJSIIy3k?${embedParams}`,
        section: "Main Flows"
    },
    {
        id: "guide-3",
        title: "Scheduling Interview",
        url: "https://youtu.be/_V6sLadTiOM",
        embedUrl: `https://www.youtube.com/embed/_V6sLadTiOM?${embedParams}`,
        section: "Individual Guide Flow"
    },
    {
        id: "guide-4",
        title: "Sharing Hotlist",
        url: "https://youtu.be/q4bcGtnx2Yw",
        embedUrl: `https://www.youtube.com/embed/q4bcGtnx2Yw?${embedParams}`,
        section: "Individual Guide Flow"
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
