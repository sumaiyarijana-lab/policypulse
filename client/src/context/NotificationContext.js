'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';
import { AlertTriangle, Info, ShieldAlert, Activity } from 'lucide-react';
import { SOCKET_URL } from '@/config/api';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Connect to Socket.IO backend
    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000
    });

    setTimeout(() => setSocket(newSocket), 0);

    newSocket.on('connect_error', () => {
      // Suppress socket error overlay in development
    });

    newSocket.on('connect', () => {
      console.log('🔌 Connected to PolicyPulse Real-Time Notification Engine');
    });

    newSocket.on('new-alert', (alertData) => {
      // Add to local history
      setAlerts(prev => [alertData, ...prev].slice(0, 50)); // Keep last 50 alerts

      // Show animated Toast
      const isCritical = alertData.priority === 'CRITICAL' || alertData.priority === 'HIGH';
      
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white dark:bg-[#0f172a] shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ${isCritical ? 'ring-red-500/50' : 'ring-blue-500/50'}`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                {isCritical ? <ShieldAlert className="text-red-500" size={24} /> : <Info className="text-blue-500" size={24} />}
              </div>
              <div className="ml-3 flex-1">
                <p className={`text-sm font-bold ${isCritical ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                  {alertData.title}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {alertData.message}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200 dark:border-white/10">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      ), {
        duration: isCritical ? 8000 : 4000,
        position: 'top-right',
      });
    });

    return () => newSocket.close();
  }, []);

  return (
    <NotificationContext.Provider value={{ socket, alerts, setAlerts }}>
      {children}
      <Toaster />
    </NotificationContext.Provider>
  );
};
