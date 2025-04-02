/*
 * --------------------------------------------------------------------------------
 * Copyright (c) 2022-NOW(至今) 锋楪技术团队
 * Author: 锋楪技术团队 (https://www.frontleaves.com)
 *
 * 本文件包含锋楪技术团队项目的源代码，项目的所有源代码均遵循 MIT 开源许可证协议。
 * --------------------------------------------------------------------------------
 * 许可证声明：
 *
 * 版权所有 (c) 2022-2025 锋楪技术团队。保留所有权利。
 *
 * 本软件是"按原样"提供的，没有任何形式的明示或暗示的保证，包括但不限于
 * 对适销性、特定用途的适用性和非侵权性的暗示保证。在任何情况下，
 * 作者或版权持有人均不承担因软件或软件的使用或其他交易而产生的、
 * 由此引起的或以任何方式与此软件有关的任何索赔、损害或其他责任。
 *
 * 使用本软件即表示您了解此声明并同意其条款。
 *
 * 有关 MIT 许可证的更多信息，请查看项目根目录下的 LICENSE 文件或访问：
 * https://opensource.org/licenses/MIT
 * --------------------------------------------------------------------------------
 * 免责声明：
 *
 * 使用本软件的风险由用户自担。作者或版权持有人在法律允许的最大范围内，
 * 对因使用本软件内容而导致的任何直接或间接的损失不承担任何责任。
 * --------------------------------------------------------------------------------
 */

import { JSX, useEffect, useRef, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { Comment, Loading, People, Robot } from "@icon-park/react";
import { message } from "antd";
import { GetAuthorizationToken } from "../../assets/ts/base_api";
import { useSelector } from "react-redux";
import { UserInfoEntity } from "@/models/entity/user_info_entity";
import { AiOperate } from "@/assets/ts/ai_operate";
import { ChatMessageDTO } from "../../models/dto/chat_message_dto";
import { useNavigate } from "react-router";
import { AiFormStore } from "@/models/store/ai_form_store";
// 定义聊天模式
type ChatMode = 'chat' | 'operation';

// WebSocket 连接状态
type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'failed';

// WebSocket 消息类型
interface WebSocketAiResponse {
    output: string;
    type: string;
    success: boolean;
    error_message?: string;
    data?: object;
}

/**
 * # AI聊天组件
 * > 提供浮动的AI助手聊天功能，支持弹出式对话框
 *
 * @returns {JSX.Element} AI聊天组件
 */
export function AiChatComponent(): JSX.Element {
    const userInfo = useSelector((state: { user: UserInfoEntity }) => state.user);
    const aiFormChat = useSelector((state: { aiFormChat: AiFormStore }) => state.aiFormChat);

    const navigate = useNavigate();

    const [isAiChatOpen, setIsAiChatOpen] = useState(false);
    const [aiMessage, setAiMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [chatMode, setChatMode] = useState<ChatMode>('chat');
    const [wsStatus, setWsStatus] = useState<WebSocketStatus>('disconnected');
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatMessageDTO[]>([
        {
            type: 'assistant',
            message: '您好！我是您的智能助手，请问有什么可以帮您？',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);

    // 连接 WebSocket
    const connectWebSocket = () => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            return; // 已连接则不再重复连接
        }

        setWsStatus('connecting');

        try {
            const wsUrl = `${import.meta.env.VITE_WS_BASE_API_URL}/ws/ai/response/front?token=${GetAuthorizationToken()}`;

            console.log("正在连接到 WebSocket:", wsUrl);
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                setWsStatus('connected');
                console.log('WebSocket 连接已建立');
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    handleWebSocketMessage(data);
                } catch (error) {
                    console.error('WebSocket 消息解析错误:', error);
                }
            };

            ws.onclose = () => {
                setWsStatus('disconnected');
                console.log('WebSocket 连接已关闭');
                wsRef.current = null;
                // 可以在这里添加重连逻辑
            };

            ws.onerror = (error) => {
                setWsStatus('failed');
                console.error('WebSocket 连接错误:', error);
                message.error('AI助手连接失败，请稍后再试');
            };
        } catch (error) {
            console.error('WebSocket 连接错误:', error);
            message.error('AI助手连接失败，请稍后再试');
        }
    };

    // 处理 WebSocket 接收到的消息
    const handleWebSocketMessage = (data: WebSocketAiResponse) => {
        // 首先检查并处理可能的错误消息
        if (!data.success && data.error_message) {
            message.error(`AI助手错误: ${data.error_message}`);
            setIsLoading(false);
            return;
        }

        switch (data.type) {
            case 'event': {
                // 处理事件类型消息
                if (data.data) {
                    const eventData = data.data as { type: string; result: string; step: string };
                    switch (eventData.type) {
                        case 'node_started': {
                            // 获取 AiOperate.nodeStarted 返回的更新后的消息历史
                            const updatedHistory = AiOperate.nodeStarted(eventData.step);
                            // 只更新聊天历史，不替换
                            setChatHistory(prev => [...prev, updatedHistory]);
                            break;
                        }
                        case 'workflow_finished': {
                            if (AiOperate.getType(eventData.result) === 'route') {
                                // 获取 AiOperate.nodeFinished 返回的更新后的消息历史和路由
                                const [updatedHistory, route] = AiOperate.nodeFinishedGetRoute(eventData.result);
                                // 只更新聊天历史，不替换
                                setChatHistory(prev => [...prev, updatedHistory]);
                                navigate(route);
                                setIsLoading(false);
                                break;
                            } else {
                                // 获取 AiOperate.nodeFinished 返回的更新后的消息历史和路由
                                const [updatedHistory, route] = AiOperate.nodeFinishGetJs(eventData.result);
                                // 只更新聊天历史，不替换
                                setChatHistory(prev => [...prev, updatedHistory]);
                                setIsLoading(false);
                                // 执行 JavaScript 代码
                                const blob = new Blob([route], { type: 'application/javascript' });
                                const url = URL.createObjectURL(blob);
                                const script = document.createElement('script');
                                script.src = url;
                                document.head.appendChild(script);
                            }
                        }
                    }
                }
                break;
            }
            case 'connected': {
                console.log("收到连接成功消息:", data);
                break;
            }
            case 'error': {
                console.log("收到错误消息:", data);
                const aiResponse: ChatMessageDTO = {
                    type: 'assistant',
                    message: data.error_message || '收到错误消息',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setChatHistory(prev => [...prev, aiResponse]);
                setIsLoading(false);
                break;
            }
            default: {
                // 处理其他未知类型的消息
                console.log("收到未知类型的消息:", data);
                if (data.output) {
                    // 如果有输出内容，默认显示为助手消息
                    const aiResponse: ChatMessageDTO = {
                        type: 'assistant',
                        message: data.output,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                    setChatHistory(prev => [...prev, aiResponse]);
                    setIsLoading(false);
                }
            }
        }
    };

    // 发送消息到 WebSocket
    const sendWebSocketMessage = (content: string, mode: ChatMode) => {
        if (wsRef.current?.readyState !== WebSocket.OPEN) {
            connectWebSocket(); // 如果未连接，先尝试连接
            message.warning('正在连接AI助手，请稍后再试...');
            return false;
        }
        try {
            if (mode === 'operation') {
                const messagePayload = {
                    user_input: content,
                    role: userInfo.user?.role.role_name,
                    form: aiFormChat.form,
                    other_data: aiFormChat.other_data,
                    record: aiFormChat.record,
                    this_page: aiFormChat.this_page,
                    chat: JSON.stringify(chatHistory)
                } as AiFormStore;
                setTimeout(() => {
                    wsRef.current?.send(JSON.stringify(messagePayload));
                }, 500);
            } else {
                // TODO: 发送消息到 WebSocket
            }
            return true;
        } catch (error) {
            console.error('发送消息失败:', error);
            message.error('消息发送失败，请稍后再试');
            return false;
        }
    };

    // 自动滚动到最新消息
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    // 聊天窗口打开时自动连接 WebSocket
    useEffect(() => {
        if (isAiChatOpen && wsStatus === 'disconnected') {
            connectWebSocket();
        }
    }, [isAiChatOpen, wsStatus]);

    // 组件加载时自动连接 WebSocket
    useEffect(() => {
        // 组件挂载时连接 WebSocket
        connectWebSocket();

        // 添加自动重连逻辑
        const reconnectInterval = setInterval(() => {
            if (wsRef.current?.readyState !== WebSocket.OPEN && wsRef.current?.readyState !== WebSocket.CONNECTING) {
                console.log("WebSocket 连接已断开，尝试重新连接...");
                connectWebSocket();
            }
        }, 10000); // 每10秒检查一次连接状态

        // 组件卸载时清理 WebSocket 连接和重连定时器
        return () => {
            clearInterval(reconnectInterval);
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, []); // 仅在组件挂载和卸载时执行

    // AI 对话框弹出动画
    const chatSpring = useSpring({
        opacity: isAiChatOpen ? 1 : 0,
        transform: isAiChatOpen ? 'translateY(0)' : 'translateY(20px)',
        config: { tension: 280, friction: 24 }
    });

    // 聊天窗口按钮动画
    const buttonSpring = useSpring({
        scale: isAiChatOpen ? 0.9 : 1,
        rotate: isAiChatOpen ? 45 : 0,
        config: { tension: 300, friction: 10 }
    });

    // AI 对话框发送消息处理函数
    const handleSendAiMessage = () => {
        if (!aiMessage.trim()) {
            message.warning("请输入对话内容");
            return;
        }

        // 添加用户消息到历史记录
        const userMessage: ChatMessageDTO = {
            type: 'user',
            message: aiMessage.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChatHistory(prev => [...prev, userMessage]);

        // 发送消息到 WebSocket
        const messageSent = sendWebSocketMessage(aiMessage, chatMode);
        if (messageSent) {
            setAiMessage("");
            setIsLoading(true);
        }
    };

    // 添加关闭键盘事件监听
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isAiChatOpen) {
                setIsAiChatOpen(false);
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isAiChatOpen]);

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
            {isAiChatOpen && (
                <animated.div style={chatSpring} className="bg-base-100 rounded-lg shadow-xl mb-4 w-96 flex flex-col border border-gray-200 overflow-hidden max-h-[38rem]">
                    <div className="p-4 bg-secondary text-white flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-white/20 flex items-center justify-center mr-2">
                                <Robot theme="filled" size="18" fill="#FFFFFF" />
                            </div>
                            <div>
                                <h3 className="font-bold">AI 智能助手</h3>
                                {
                                    <div className="text-xs opacity-80 flex items-center">
                                        <span className={`inline-block w-2 h-2 rounded-full mr-1 ${wsStatus === 'connected' ? 'bg-green-500' :
                                            wsStatus === 'connecting' ? 'bg-yellow-400' :
                                                wsStatus === 'failed' ? 'bg-red-500' : 'bg-gray-400'
                                            }`}></span>
                                        {
                                            wsStatus === 'disconnected' ? '未连接' :
                                                wsStatus === 'connecting' ? '连接中...' :
                                                    wsStatus === 'failed' ? '连接失败' : '已连接'
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="btn btn-ghost btn-xs btn-circle text-white hover:bg-secondary-focus"
                                onClick={() => setIsAiChatOpen(false)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div
                        ref={chatContainerRef}
                        className="bg-base-200/80 p-4 overflow-y-auto flex-1"
                    >
                        {chatHistory.map((chat, index) => (
                            <div key={index} className={`chat ${chat.type === 'user' ? 'chat-end' : 'chat-start'} mb-3`}>
                                <div className="chat-image avatar">
                                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                                        {chat.type === 'user' ? (
                                            <div className="bg-primary w-full h-full flex items-center justify-center">
                                                <People theme="filled" size="18" fill="#FFFFFF" />
                                            </div>
                                        ) : (
                                            <div className="bg-secondary w-full h-full flex items-center justify-center">
                                                <Robot theme="filled" size="18" fill="#FFFFFF" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="chat-header opacity-70 text-xs mb-1">
                                    {chat.type === 'user' ? '您' : 'AI助手'}
                                    <time className="ml-1">{chat.timestamp}</time>
                                </div>
                                <div className={`chat-bubble ${chat.type === 'user' ? 'chat-bubble-primary' : 'chat-bubble-secondary'}`}>
                                    {chat.message}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-base-100 border-t border-gray-200">
                        <div className="relative mb-2">
                            <textarea
                                className="textarea textarea-bordered w-full min-h-20 text-sm resize-none focus:ring-2 focus:ring-secondary/30 pr-20 pb-10"
                                placeholder={chatMode === 'chat' ? "请输入您想问的问题..." : "请输入您想执行的操作..."}
                                value={aiMessage}
                                onChange={(e) => setAiMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendAiMessage();
                                    }
                                }}
                                disabled={wsStatus === 'failed'}
                            ></textarea>
                            <div className="absolute bottom-2 left-3 flex items-center gap-2">
                                <span className="text-xs text-gray-500">
                                    {chatMode === 'chat' ? '对话' : '操作'}
                                </span>
                                <input
                                    type="checkbox"
                                    className={`toggle toggle-sm ${chatMode === 'chat' ? 'toggle-secondary' : 'toggle-primary'}`}
                                    checked={chatMode === 'operation'}
                                    onChange={() => setChatMode(chatMode === 'chat' ? 'operation' : 'chat')}
                                />
                            </div>
                            <button
                                className={`absolute bottom-2 right-2 btn btn-sm ${chatMode === 'chat' ? 'btn-secondary' : 'btn-primary'}`}
                                onClick={handleSendAiMessage}
                                disabled={isLoading || wsStatus === 'failed'}
                            >
                                {isLoading ? (
                                    <Loading theme="outline" size="16" fill="currentColor" className="animate-spin mr-1" />
                                ) : null}
                                发送
                            </button>
                        </div>
                        <div className="flex items-center">
                            <div className="text-xs text-gray-500 flex gap-3">
                                <span>Shift + Enter 换行</span>
                                <span>Esc 关闭窗口</span>
                                <span>当前页面: {aiFormChat.this_page}</span>
                            </div>
                        </div>
                    </div>
                </animated.div>
            )}
            <animated.button
                style={{
                    ...buttonSpring,
                    transformOrigin: 'center'
                }}
                onClick={() => setIsAiChatOpen(!isAiChatOpen)}
                className="btn btn-secondary rounded-full w-12 h-12 flex items-center justify-center text-white hover:bg-secondary-focus hover:shadow-lg transition-all shadow-md"
            >
                {isAiChatOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <div className="flex items-center justify-center">
                        <Comment theme="filled" size="22" fill="#FFFFFF" />
                    </div>
                )}
            </animated.button>
        </div>
    );
} 