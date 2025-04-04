/**
 * # BatchImportFailedDetailDTO
 * > 批量导入失败的详细信息
 */
export type BatchImportFailedDetailDTO = {
    row: number;
    reason: string;
}

/**
 * # BatchImportResponseDTO
 * > 批量导入响应数据
 */
export type BatchImportResponseDTO = {
    total_count: number;
    success_count: number;
    failed_count: number;
    failed_details: BatchImportFailedDetailDTO[];
} 