import React, { useEffect } from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  message: ToastMessage;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(message.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [message.id, onClose]);

  const bgColors = {
    success: 'bg-secondary',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };

  const icons = {
    success: 'fa-circle-check',
    error: 'fa-circle-exclamation',
    info: 'fa-circle-info'
  };

  return (
    <div className={`${bgColors[message.type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center mb-3 animate-fade-in-up min-w-[300px]`}>
      <i className={`fa-solid ${icons[message.type]} mr-3 text-lg`}></i>
      <span className="font-medium">{message.message}</span>
      <button onClick={() => onClose(message.id)} className="ml-auto text-white/80 hover:text-white">
        <i className="fa-solid fa-xmark"></i>
      </button>
    </div>
  );
};