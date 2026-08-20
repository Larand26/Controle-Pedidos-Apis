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
      message: "Status recuperado com sucesso",
      data: result[0],
    };
  } catch (error) {
    return {
      success: false,
      message: "Falha ao recuperar o status",
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
        message: "Pedido não encontrado",
        code: "ORDER_NOT_FOUND",
      };
    }
    return {
      success: true,
      message: "Pedido recuperado com sucesso",
      data: result[0],
    };
  } catch (error) {
    return {
      success: false,
      message: "Falha ao recuperar o pedido",
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
        message: "Falha ao recuperar o status anterior",
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
      message: "Histórico do pedido inserido com sucesso",
    };
  } catch (error) {
    return {
      success: false,
      message: "Falha ao inserir o histórico do pedido",
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
        message: "ID de status inválido",
        code: "INVALID_STATUS_ID",
      };
    }

    // Checa se o pedido existe
    const orderCheck = await getOrderById(orderId);
    if (!orderCheck.success || !orderCheck.data) {
      return {
        success: false,
        message: "Pedido não encontrado",
        code: "ORDER_NOT_FOUND",
      };
    }

    if (orderCheck.data.ID_SITUACAO === newStatusID) {
      return {
        success: false,
        message: "O pedido já possui o status",
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
        message: "Falha ao inserir o histórico",
        code: "ORDER_HISTORY_INSERT_FAILED",
      };
    }

    // 2. Calcula o tempo total de execução
    const endTime = Date.now();
    const startTime = new Date(orderCheck.data.CPVDataAlteracao).getTime();
    const executionTimeMs = endTime - startTime;

    return {
      success: true,
      message: "Status do pedido alterado com sucesso",
      data: {
        order: orderCheck.data.ID_Pedido,
        newStatus: statusCheck.data.SIT_DESCRICAO,
        time: executionTimeMs,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Falha ao alterar o status",
      code: "ORDER_STATUS_CHANGE_FAILED",
      error,
    };
  }
}

export async function getOrderStatus(): Promise<
  ResponseSuccess | ResponseError
> {
  try {
    const query = `
        SELECT *
        FROM [CPV_SITUACAO]
    `;
    const result = await executeQuery(query);
    return {
      success: true,
      message: "Status do pedido recuperados com sucesso",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "Falha ao recuperar os status do pedido",
      code: "ORDER_STATUS_RETRIEVAL_FAILED",
      error,
    };
  }
}
