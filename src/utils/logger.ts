import chalk from "chalk";

// Função auxiliar para pegar o horário atual
function getTimestamp() {
  const agora = new Date();
  return agora.toLocaleTimeString("pt-BR");
}

const logger = {
  info: (mensagem: string) => {
    console.log(
      `${chalk.gray(`[${getTimestamp()}]`)} ${chalk.blue.bold("ℹ INFO:")} ${mensagem}`,
    );
  },
  warn: (mensagem: string) => {
    console.warn(
      `${chalk.gray(`[${getTimestamp()}]`)} ${chalk.yellow.bold("⚠ AVISO:")} ${mensagem}`,
    );
  },
  error: (mensagem: string) => {
    console.error(
      `${chalk.gray(`[${getTimestamp()}]`)} ${chalk.red.bold("✖ ERRO:")} ${mensagem}`,
    );
  },
  success: (mensagem: string) => {
    console.log(
      `${chalk.gray(`[${getTimestamp()}]`)} ${chalk.green.bold("✔ SUCESSO:")} ${mensagem}`,
    );
  },
};

export default logger;
