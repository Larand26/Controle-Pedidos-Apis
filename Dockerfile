# 1. Define a imagem base oficial do Node.js (versão leve 'alpine')
FROM node:20-alpine

# 2. Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# 3. Copia apenas os arquivos de dependência primeiro (otimiza o cache do Docker)
COPY package.json package-lock.json* ./

# 4. Instala as dependências
RUN npm install

# 5. Copia o restante do código do projeto para o contêiner
COPY . .

# 6. Executa o build do TypeScript (gera a pasta dist/build)
RUN npm run build

# 7. Expõe a porta que a sua API utiliza (ajuste se sua API usar uma porta diferente de 3000)
EXPOSE 3000

# 8. Comando para iniciar a aplicação (ajuste para o seu script de produção, ex: npm run start)
CMD ["npm", "run", "start"]