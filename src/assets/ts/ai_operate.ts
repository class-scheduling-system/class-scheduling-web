import { ChatMessageDTO } from "../../models/dto/chat_message_dto";

export class AiOperate {
    /**
     * # 节点开始
     * > 更新最后一个机器人消息
     * 
     * @param chatHistory 聊天历史
     * @param result 结果
     * @returns 最后一个机器人消息
     */
    public static nodeStarted(chatHistory: Array<ChatMessageDTO>, result: string): ChatMessageDTO {
        // 获取最后一个机器人消息
        const lastRobotMessage = chatHistory
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            .find(message => message.type === 'assistant');
        if (lastRobotMessage) {
            lastRobotMessage.message = result;
        }
        return lastRobotMessage!;
    }

    /**
     * # 节点结束
     * > 返回路由
     * 
     * @param chatHistory 聊天历史
     * @param result 结果
     * @returns 路由
     */
    static nodeFinished(chatHistory: ChatMessageDTO[], result: string): string {
        const lastRobotMessage = chatHistory
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            .find(message => message.type === 'assistant');
        if (lastRobotMessage) {
            lastRobotMessage.message = "操作完成";
        }
        // 返回路由
        return JSON.parse(result).route as string;
    }
}
