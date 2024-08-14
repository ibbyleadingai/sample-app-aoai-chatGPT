import React, { useEffect } from 'react';

interface AutoRefreshOnInactivityProps {
    inactivityThresholdinMinutes?: number; // Time in milliseconds before refreshing the page
}

const AutoRefreshOnInactivity: React.FC<AutoRefreshOnInactivityProps> = ({
    inactivityThresholdinMinutes = 60, // Default to 60 minutes
}) => {
    let inactivityThreshold = 1000 * 60 * inactivityThresholdinMinutes
    useEffect(() => {
        let inactivityTimer: ReturnType<typeof setTimeout>;

        const resetInactivityTimer = () => {
            if (inactivityTimer) {
                clearTimeout(inactivityTimer);
            }
            inactivityTimer = setTimeout(() => {
                alert(`You’ve been inactive for ${inactivityThresholdinMinutes} minutes. The page will refresh.`);
                window.location.reload();
            }, inactivityThreshold);
        };

        const handleUserActivity = () => {
            resetInactivityTimer();
        };

        // Attach event listeners
        const events = ['mousemove', 'keydown', 'click', 'scroll'];
        events.forEach((event) =>
            window.addEventListener(event, handleUserActivity)
        );

        // Initial timer setup
        resetInactivityTimer();

        // Cleanup on component unmount
        return () => {
            if (inactivityTimer) {
                clearTimeout(inactivityTimer);
            }
            events.forEach((event) =>
                window.removeEventListener(event, handleUserActivity)
            );
        };
    }, [inactivityThreshold]);

    return null;
};

export default AutoRefreshOnInactivity;
