FROM eclipse-temurin:17-jdk-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar librerías
COPY libs/*.jar /app/libs/

# Copiar archivos Java
COPY java/*.java /app/

# Compilar la aplicación Java
RUN javac -cp "/app/libs/*" BuscadorAvesAPI.java

# Esperar a que la API esté disponible antes de ejecutar
CMD ["sh", "-c", "sleep 5 && java -cp '/app/libs/*:/app' BuscadorAvesAPI"]
