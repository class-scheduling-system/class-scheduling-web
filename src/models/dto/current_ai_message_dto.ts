/**
 * # 当前AI消息类型
 * > 定义当前AI消息类型
 * 
 * @param {string} thought - 思考
 * @param {string} message - 消息
 */
export type CurrentAiMessageDTO = {
    thought: string;
    message: string;
}