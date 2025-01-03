import { useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

export const useSocket = ({ onUsers, onCursorMove, onCodeUpdate }) => {
  useEffect(() => {
    socket.on('users', onUsers);
    socket.on('userCursorMove', onCursorMove);
    socket.on('codeUpdate', onCodeUpdate);

    return () => {
      socket.off('users');
      socket.off('userCursorMove');
      socket.off('codeUpdate');
    };
  }, [onUsers, onCursorMove, onCodeUpdate]);

  return socket;
};