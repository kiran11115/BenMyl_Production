import { useState, useEffect, useCallback, useRef } from "react";

const LOCKS_KEY = "resume_locks";
const CHANNEL_NAME = "resume_lock_channel";
const TTL = 30000; // 30 seconds
const CLEANUP_INTERVAL = 5000; // 5 seconds
const HEARTBEAT_INTERVAL = 10000; // 10 seconds

/**
 * Hook to manage resume viewing locks across browser tabs
 * Uses BroadcastChannel and localStorage to simulate real-time behavior
 */
export const useResumeLock = () => {
    const [locks, setLocks] = useState({});
    const currentUser = localStorage.getItem("UserName") || "Unknown User";
    const channelRef = useRef(null);

    // Load initial locks from localStorage
    const getStoredLocks = useCallback(() => {
        try {
            const stored = localStorage.getItem(LOCKS_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error("Failed to parse resume_locks", e);
            return {};
        }
    }, []);

    const saveLocks = useCallback((newLocks) => {
        localStorage.setItem(LOCKS_KEY, JSON.stringify(newLocks));
        setLocks(newLocks);
    }, []);

    // 1. Initialize channel and state
    useEffect(() => {
        setLocks(getStoredLocks());

        if (typeof window !== "undefined" && window.BroadcastChannel) {
            channelRef.current = new BroadcastChannel(CHANNEL_NAME);
            
            const handleMessage = (event) => {
                const { type, id, user, allLocks } = event.data;
                
                if (type === "SYNC") {
                    setLocks(allLocks);
                } else {
                    // Quick refresh from disk or partial update
                    setLocks(getStoredLocks());
                }
            };

            channelRef.current.onmessage = handleMessage;

            // Handle incoming updates from other tabs
            const handleStorage = (e) => {
                if (e.key === LOCKS_KEY) {
                    setLocks(getStoredLocks());
                }
            };
            window.addEventListener("storage", handleStorage);

            return () => {
                channelRef.current?.close();
                window.removeEventListener("storage", handleStorage);
            };
        }
    }, [getStoredLocks]);

    // 2. Heartbeat & Cleanup
    useEffect(() => {
        const interval = setInterval(() => {
            const currentLocks = getStoredLocks();
            const now = Date.now();
            let changed = false;

            // Cleanup expired locks
            const updatedLocks = Object.entries(currentLocks).reduce((acc, [id, lock]) => {
                if (now - lock.timestamp < TTL) {
                    acc[id] = lock;
                } else {
                    changed = true;
                }
                return acc;
            }, {});

            if (changed) {
                saveLocks(updatedLocks);
                channelRef.current?.postMessage({ type: "SYNC", allLocks: updatedLocks });
            }
        }, CLEANUP_INTERVAL);

        return () => clearInterval(interval);
    }, [getStoredLocks, saveLocks]);

    // 3. Heartbeat for active session
    // This ensures that if the tab is open, the lock doesn't expire
    const heartbeat = useCallback((id) => {
        const currentLocks = getStoredLocks();
        if (currentLocks[id] && currentLocks[id].user === currentUser) {
            currentLocks[id].timestamp = Date.now();
            saveLocks(currentLocks);
        }
    }, [currentUser, getStoredLocks, saveLocks]);

    // Actions
    const startViewing = useCallback((id) => {
        if (!id) return;
        const currentLocks = getStoredLocks();
        
        // Don't override someone else's lock unless it's expired (cleanup handles this)
        if (currentLocks[id] && currentLocks[id].user !== currentUser) {
            return false;
        }

        currentLocks[id] = {
            user: currentUser,
            timestamp: Date.now()
        };

        saveLocks(currentLocks);
        channelRef.current?.postMessage({ type: "LOCK", id, user: currentUser });
        return true;
    }, [currentUser, getStoredLocks, saveLocks]);

    const stopViewing = useCallback((id) => {
        if (!id) return;
        const currentLocks = getStoredLocks();
        
        if (currentLocks[id] && currentLocks[id].user === currentUser) {
            delete currentLocks[id];
            saveLocks(currentLocks);
            channelRef.current?.postMessage({ type: "UNLOCK", id });
        }
    }, [currentUser, getStoredLocks, saveLocks]);

    const getLock = useCallback((id) => locks[id], [locks]);

    const isMuted = useCallback((id) => {
        const lock = locks[id];
        return !!(lock && lock.user !== currentUser);
    }, [locks, currentUser]);

    return {
        startViewing,
        stopViewing,
        getLock,
        isMuted,
        currentUser,
        refresh: () => setLocks(getStoredLocks())
    };
};
