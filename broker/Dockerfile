FROM node:16-alpine

WORKDIR /app

# Instala dependências do broker MQTT
COPY package*.json ./
RUN npm install

# Copia o código do broker
COPY . .

# Exponha a porta do MQTT
EXPOSE 1883

# Comando para iniciar o broker
CMD ["node", "broker.js"]
