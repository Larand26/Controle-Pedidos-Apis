import type {
  ResponseSuccess,
  ResponseError,
} from "../interfaces/response.type.js";

import { executeQuery } from "../db/db.js";

async function getStatusById(
  statusId: number,
): Promise<ResponseSuccess | ResponseError> {
  try {
    const query = `
        SELECT * 
        FROM [CPV_SITUACAO]
        WHERE [ID_SITUACAO] = @statusId
    `;
    const result = await executeQuery(query, { statusId });
    return {
      success: true,
      message: "Status retrieved successfully",
      data: result[0],
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to retrieve status",
      code: "STATUS_RETRIEVAL_FAILED",
      error,
    };
  }
}

export async function changeOrderStatus(
  orderId: number,
  newStatusID: number,
): Promise<ResponseSuccess | ResponseError> {
  try {
    // Checa se o novo status é válido
    const statusCheck = await getStatusById(newStatusID);
    if (!statusCheck.success || !statusCheck.data) {
      return {
        success: false,
        message: "Invalid status ID",
        code: "INVALID_STATUS_ID",
      };
    }
    // Muda o status do pedido no banco de dados
    return {
      success: true,
      message: "Order status changed successfully",
      data: {
        orderId,
        newStatusID,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to change order status",
      code: "ORDER_STATUS_CHANGE_FAILED",
      error,
    };
  }
}
