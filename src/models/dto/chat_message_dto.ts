/**
 * # 聊天消息类型
 * > 定义聊天消息类型
 * 
 * @param {string} type - 消息类型
 * @param {string} message - 消息内容
 * @param {string} timestamp - 消息时间
 */
export type ChatMessageDTO = {
    type: 'user' | 'assistant';
    message: string;
    timestamp: string;
}
