import React, { useEffect } from 'react';

interface AutoRefreshOnInactivityProps {
    inactivityThresholdinMinutes?: number; // Time in milliseconds before refreshing the page
}

const AutoRefreshOnInactivity: React.FC<AutoRefreshOnInactivityProps> = ({
    inactivityThresholdinMinutes = 180, // Default to 180 minutes
}) => {
    let inactivityThreshold = 1000 * 60 * inactivityThresholdinMinutes
    useEffect(() => {
        let inactivityTimer: ReturnType<typeof setTimeout>; //holds the ID of the timer created by setTimeout

        const resetInactivityTimer = () => {
            if (inactivityTimer) { //clears any existing timer and then starts a new one with the updated inactivityThreshold
                clearTimeout(inactivityTimer);
            }
            inactivityTimer = setTimeout(() => { //This function creates a timer based on the inactivityThreshold. Thre content inside is what should happen when timer is completed.
                alert(`Session timeout. The page will refresh.`); 
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
        return () => { //clears the inactivity timer and removes the event listeners to prevent memory leaks.
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
