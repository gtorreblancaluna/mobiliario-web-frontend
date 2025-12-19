# ==========================================================
# ETAPA 1: BUILD - Construir la aplicación Vue (con Node.js)
# ==========================================================
FROM node:20-alpine AS build-stage

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código fuente
COPY . .

# Ejecutar el build de producción (generará la carpeta 'dist')
# Si usas Vite, el comando por defecto es 'npm run build'
RUN npm run build

# ==========================================================
# ETAPA 2: PRODUCTION - Servir los archivos estáticos (con Nginx)
# ==========================================================
FROM nginx:alpine AS production-stage

# Copiar el archivo de configuración personalizado de Nginx
# (Ver Paso 1.3 - Necesario para SPAs)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos estáticos generados en la etapa de build
# desde /app/dist hacia el directorio de servicio de Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Exponer el puerto 8080 (Cloud Run usa la variable de entorno $PORT, pero el
# contenedor debe escuchar en el puerto configurado en nginx.conf)
EXPOSE 8080

# El comando por defecto de Nginx ya es iniciar el servidor
CMD ["nginx", "-g", "daemon off;"]