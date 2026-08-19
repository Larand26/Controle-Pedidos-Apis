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

async function getOrderById(
  orderId: number,
): Promise<ResponseSuccess | ResponseError> {
  try {
    const query = `
        SELECT * 
        FROM [CPV_PEDIDO]
        WHERE [ID_NUMPEDORC] = @orderId
    `;
    const result = await executeQuery(query, { orderId });
    if (result.length === 0) {
      return {
        success: false,
        message: "Order not found",
        code: "ORDER_NOT_FOUND",
      };
    }
    return {
      success: true,
      message: "Order retrieved successfully",
      data: result[0],
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to retrieve order",
      code: "ORDER_RETRIEVAL_FAILED",
      error,
    };
  }
}

async function insertOrderHistory(
  statusData: any,
  orderData: any,
): Promise<ResponseSuccess | ResponseError> {
  try {
    const historyQuery = `
        INSERT INTO "CPV_Historico" ("ID_HISTORICO", "ID_CODFILIAIS", "ID_NUMPEDORC", "ID_TIPOPEDORC", "CPV_DATA", "CPV_ID_USUARIO", "CPV_ACAO", "CPV_DESCRICAO", "CPV_OBS", "ID_SITUACAO")
        VALUES ((SELECT ISNULL(MAX("ID_HISTORICO"), 0) + 1 FROM "CPV_Historico"), @ID_CODFILIAIS, @ID_NUMPEDORC, @ID_TIPOPEDORC, GETDATE(), @CPV_ID_USUARIO, @CPV_ACAO, @CPV_DESCRICAO, @CPV_OBS, @ID_SITUACAO)
    `;
    const beforeStatus = await getStatusById(orderData.ID_SITUACAO);
    if (!beforeStatus.success || !beforeStatus.data) {
      return {
        success: false,
        message: "Failed to retrieve previous status",
        code: "PREVIOUS_STATUS_RETRIEVAL_FAILED",
      };
    }

    const params = {
      ID_CODFILIAIS: orderData.ID_CODFILIAIS,
      ID_NUMPEDORC: orderData.ID_NUMPEDORC,
      ID_TIPOPEDORC: orderData.ID_TIPOPEDORC,
      CPV_ID_USUARIO: 11,
      CPV_ACAO: "Alteração de status",
      CPV_DESCRICAO: `Alterou a Situação de: "${beforeStatus.data.SIT_DESCRICAO}" para: "${statusData.SIT_DESCRICAO}"`,
      CPV_OBS: "",
      ID_SITUACAO: statusData.ID_SITUACAO,
    };

    await executeQuery(historyQuery, params);

    return {
      success: true,
      message: "Order history inserted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to insert order history",
      code: "ORDER_HISTORY_INSERT_FAILED",
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
    // Checa se o pedido existe
    const orderCheck = await getOrderById(orderId);
    if (!orderCheck.success || !orderCheck.data) {
      return {
        success: false,
        message: "Order not found",
        code: "ORDER_NOT_FOUND",
      };
    }

    if (orderCheck.data.ID_SITUACAO === newStatusID) {
      return {
        success: false,
        message: "Order already has the specified status",
        code: "ORDER_ALREADY_HAS_STATUS",
      };
    }

    // Muda o status do pedido no banco de dados
    const query = `
        UPDATE "CPV_Pedido"
        SET "ID_SITUACAO" = @newStatusID,
        "CPVDataAlteracao" = GETDATE()
        WHERE "ID_NUMPEDORC" = @orderId
    `;
    await executeQuery(query, { orderId, newStatusID });

    // Adiciona um registro no histórico do pedido
    const response = await insertOrderHistory(
      statusCheck.data,
      orderCheck.data,
    );

    if (!response.success) {
      return {
        success: false,
        message: "Failed to insert order history",
        code: "ORDER_HISTORY_INSERT_FAILED",
      };
    }

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
