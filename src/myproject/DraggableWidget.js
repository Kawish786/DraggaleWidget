import React, { useState, useEffect } from 'react';
import '../myproject/DraggableWidget.css';

const DraggableWidget = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [screenTime, setScreenTime] = useState(0);
  const [isIdle, setIsIdle] = useState(false);
  const [ idleTimeThreshold, setIdleTimeThreshold ]= useState(60000);

  // Track screen time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setScreenTime((prevScreenTime) => prevScreenTime + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);


// Monitor user activity and detect idleness
useEffect(() => {
    let idleTimer = null;

    const handleUserActivity = () => {
      if (idleTimer) {
        clearTimeout(idleTimer);
        idleTimer = null;
      }

      if (isIdle) {
        setIsIdle(false);
        setScreenTime(0);
      }

      idleTimer = setTimeout(() => {
        setIsIdle(true);
      }, idleTimeThreshold);
    };

    document.addEventListener('mousemove', handleUserActivity);
    document.addEventListener('keydown', handleUserActivity);

    return () => {
      clearTimeout(idleTimer);
      document.removeEventListener('mousemove', handleUserActivity);
      document.removeEventListener('keydown', handleUserActivity);
    };
  }, [isIdle]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isDragging]);


  const handleContextMenu = (e) => {
    e.preventDefault();
    // Show context menu and modify idle time threshold
    const newThreshold = parseInt(prompt('Enter new idle time threshold (in milliseconds):'), 10);
    if (!isNaN(newThreshold)) {
      setIdleTimeThreshold(newThreshold);
    }
  };
   

  return (
    
    <div
      className={`draggable-widget ${isDragging ? 'dragging' : ''}`}
      style={{ top: position.y, left: position.x }}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
    >
      <div className="widget-content">
        <h3>Draggable Widget</h3>
        <p>Total Screen Time: {screenTime} seconds</p>
        <p>Status: {isIdle ? 'Idle' : 'Active'}</p>
        <p style={{color:"yellow"}}>*Right click to change Idle time*</p>
      </div>
    </div>
    
  );
};

//  function to format time in HH:mm:ss format
const formatTime = (time) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
};

//  function to pad single digit numbers with leading zero
const padZero = (num) => {
  return num.toString().padStart(2, '0');
};

export default DraggableWidget;
