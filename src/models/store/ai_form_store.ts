/**
 * 表单数据
 */
export type AiFormStore = {
    /**
     * 用户输入
     */
    user_input: string,

    /**
     * 角色
     */
    role: string,
    /**
     * 类型
     */
    type: "operate" | "chat",
    /**
     * 表单数据
     */
    form: Record<string, HtmlRecordStore>,

    /**
     * 其他数据
     */
    other_data: string,

    /**
     * 记录
     */
    record?: Record<string, HtmlRecordStore>,

    /**
     * 当前页面
     */
    this_page: string,

    /**
     * 聊天历史
     */
    chat: string,

    /**
     * 返回数据
     */
    for_back_data: string,

    /**
     * 对话ID
     */
    metadata?: string,
}

/**
 * 记录
 */
export type HtmlRecordStore = {
    /**
     * 类型
     */
    type: string,
    /**
     * 值
     */
    value?: string,
    /**
     * 提示
     */
    placeholder?: string,
    /**
     * 选项
     */
    options?: string[],

    /**
     * 是否必填
     */
    required?: boolean,

    /**
     * 是否只读
     */
    readonly?: boolean,
    

    /**
     * 是否禁用
     */
    disabled?: boolean,

    /**
     * 是否隐藏
     */
    hidden?: boolean,

    /**
     * 是否显示
     */
    visible?: boolean,
}