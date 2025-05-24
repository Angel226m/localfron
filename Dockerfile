# Usa una imagen de Node.js ligera basada en Alpine
FROM node:23-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de dependencias y luego instala las dependencias
COPY package*.json ./
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Expone el puerto en el que se ejecutará la aplicación
EXPOSE 5173

# Inicia el servidor de desarrollo de Vite
CMD ["npm", "run", "dev"]
