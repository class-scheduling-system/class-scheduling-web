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
    public static nodeStarted(result: string): ChatMessageDTO {
        const lastMessage = {
            type: 'assistant',
            message: `正在进行${result}......`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        } as ChatMessageDTO;

        // 返回新的聊天历史副本
        return lastMessage;
    }

    /**
     * # 节点结束
     * > 返回路由
     * 
     * @param chatHistory 聊天历史
     * @param result 结果
     * @returns 路由
     */
    static nodeFinished(result: string): [ChatMessageDTO, string] {
        const lastMessage = {
            type: 'assistant',
            message: "操作完成",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        } as ChatMessageDTO;

        // 返回新的聊天历史副本
        return [lastMessage, JSON.parse(result).route as string];
    }
}
