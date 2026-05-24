// src/context/SocketContext.js
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { SOCKET_URL } from "../config";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
    const { user } = useAuth();
    const socketRef = useRef(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [, setMessageListeners] = useState([]);
    const [, setBlockedListeners] = useState([]);

    useEffect(() => {
        if (!user) {
            socketRef.current?.disconnect();
            socketRef.current = null;
            setOnlineUsers([]);
            return;
        }

        const s = io(SOCKET_URL, { transports: ["websocket", "polling"] });
        socketRef.current = s;

        s.on("connect", () => {
            s.emit("authenticate", { userId: user.id });
        });

        s.on("online_users", (users) => setOnlineUsers(users));

        s.on("user_status", ({ userId, online }) => {
            setOnlineUsers((prev) =>
                online ? [...new Set([...prev, userId])] : prev.filter((id) => id !== userId)
            );
        });

        s.on("new_message", (data) => {
            // Notify all registered message listeners
            setMessageListeners((listeners) => {
                listeners.forEach((fn) => fn(data));
                return listeners;
            });
        });

        s.on("message_blocked", (data) => {
            // Notify all registered blocked listeners
            setBlockedListeners((listeners) => {
                listeners.forEach((fn) => fn(data));
                return listeners;
            });
        });

        s.on("incoming_request", (req) => {
            setNotifications((prev) => [{ ...req, read: false, ts: Date.now() }, ...prev]);
        });

        s.on("request_accepted", (req) => {
            setNotifications((prev) => [
                { ...req, read: false, ts: Date.now(), accepted: true }, ...prev,
            ]);
        });

        s.on("connection_updated", ({ userId, targetId, connected }) => {
            // Expose via event so Discover/Network can react
            window.dispatchEvent(new CustomEvent("ss_connection_update", { detail: { userId, targetId, connected } }));
        });

        s.on("meeting_created", (mtg) => {
            window.dispatchEvent(new CustomEvent("ss_meeting_created", { detail: mtg }));
        });

        return () => {
            s.disconnect();
            socketRef.current = null;
        };
    }, [user]);

    const sendMessage = useCallback((from, to, text) => {
        socketRef.current?.emit("send_message", { from, to, text });
    }, []);

    const sendTyping = useCallback((from, to) => {
        socketRef.current?.emit("typing", { from, to });
    }, []);

    const sendSwapRequest = useCallback((from, to, offer, want) => {
        socketRef.current?.emit("swap_request", { from, to, offer, want });
    }, []);

    const sendMessageRequest = useCallback((from, to) => {
        socketRef.current?.emit("message_request", { from, to });
    }, []);

    const acceptRequest = useCallback((requestId, userId) => {
        socketRef.current?.emit("accept_request", { requestId, userId });
    }, []);

    const addMessageListener = useCallback((fn) => {
        setMessageListeners((prev) => [...prev, fn]);
        return () => setMessageListeners((prev) => prev.filter((f) => f !== fn));
    }, []);

    const addBlockedListener = useCallback((fn) => {
        setBlockedListeners((prev) => [...prev, fn]);
        return () => setBlockedListeners((prev) => prev.filter((f) => f !== fn));
    }, []);

    const isOnline = useCallback((userId) => onlineUsers.includes(userId), [onlineUsers]);

    const clearNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    return (
        <SocketContext.Provider value={{
            socket: socketRef.current,
            onlineUsers,
            notifications,
            isOnline,
            sendMessage,
            sendTyping,
            sendSwapRequest,
            sendMessageRequest,
            acceptRequest,
            addMessageListener,
            addBlockedListener,
            clearNotification,
        }}>
            {children}
        </SocketContext.Provider>
    );
}

export const useSocket = () => useContext(SocketContext);
