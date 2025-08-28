import { useEffect, useRef, useState } from 'react';

interface WebSocketMessage {
  type: string;
  data?: any;
}

export const useWebSocket = (url: string, autoConnect: boolean = true) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutId = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);

  const connect = () => {
    if (!autoConnect) return;
    
    try {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        reconnectAttempts.current = 0;
      };

      ws.current.onclose = (event) => {
        console.log('WebSocket disconnected (this is normal if OBS is not running):', event.reason);
        setIsConnected(false);
        
        // Attempt to reconnect with exponential backoff (reduced attempts)
        if (reconnectAttempts.current < 2) {
          const delay = Math.pow(2, reconnectAttempts.current) * 1000;
          reconnectTimeoutId.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, Math.min(delay, 5000)); // Cap at 5 seconds
        }
      };

      ws.current.onerror = (error) => {
        console.log('WebSocket connection failed (OBS WebSocket server not available)');
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
    } catch (error) {
      console.log('WebSocket connection not available (this is normal if OBS is not running)');
    }
  };

  const sendMessage = (message: WebSocketMessage) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      // Silently ignore messages when not connected to avoid console spam
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutId.current) {
      clearTimeout(reconnectTimeoutId.current);
    }
    if (ws.current) {
      ws.current.close();
    }
  };

  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    return () => disconnect();
  }, [url, autoConnect]);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    disconnect,
    connect
  };
};