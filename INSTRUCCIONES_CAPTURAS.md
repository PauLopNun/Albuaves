# 📸 Instrucciones para Completar las Capturas

Para cumplir completamente con los requisitos de la tarea, necesitas agregar **2 capturas de pantalla reales** al directorio `docimgs/`.

---

## ✅ Ya tienes (COMPLETO):

1. ✅ **Interfaz Web funcionando**
   - Archivo: `docimgs/Albuaves - Sistema de Gestión de Aves-1.png`
   - Ya está referenciada en el README

---

## ❌ FALTA (Necesitas tomar estas capturas):

### 1. 📡 Captura de la API en el Navegador

**Qué hacer:**

1. **Inicia el sistema:**
   ```bash
   # En Windows:
   run-docker.bat

   # En Linux/Mac:
   ./run-docker.sh
   ```

2. **Espera a que el sistema esté listo** (verás en la terminal que el cliente Java se ejecuta)

3. **Abre tu navegador** y ve a:
   ```
   http://localhost:9191/api.php
   ```

4. **Toma una captura de pantalla** mostrando:
   - La URL completa en la barra de direcciones
   - El JSON completo con las 10 aves
   - Asegúrate de que se vea claramente el formato JSON

5. **Guarda la captura como:**
   ```
   docimgs/api-browser-json.png
   ```

6. **Agrega la captura al README:**
   Busca en el README la línea que dice:
   ```markdown
   ### 📡 API Response - Example

   Access the API directly in your browser: `http://localhost:9191/api.php`
   ```

   Y agrega DESPUÉS de esa línea:
   ```markdown
   ![API JSON Response in Browser](docimgs/api-browser-json.png)
   ```

---

### 2. 💻 Captura del Cliente Java en la Terminal

**Qué hacer:**

1. **El sistema ya está ejecutándose** desde el paso anterior

2. **Observa la terminal/consola** donde ejecutaste `run-docker.bat` o `run-docker.sh`

3. **Busca la salida del cliente Java**, que se verá así:
   ```
   API Response:
   🌿 List of birds in Albufera 🌿

   +----+----------------+---------------------+----------------+-----------------------+
   | ID |      Name      |      Scientific     |   Description  | Img    |
   +----+----------------+---------------------+----------------+-----------------------+
   |  1 | Martinete      | Nycticorax nyctico… | Ave nocturna d… | imgs/aves/martinete.j…|
   ...
   ```

4. **Toma una captura de pantalla** mostrando:
   - La terminal completa con el comando que ejecutaste
   - La tabla de salida del cliente Java
   - Todas las 10 aves listadas

5. **Guarda la captura como:**
   ```
   docimgs/java-client-terminal.png
   ```

6. **Agrega la captura al README:**
   Busca en el README la línea que dice:
   ```markdown
   ### 💻 Java Client - Terminal Output

   The Java client consumes the API and displays results in a formatted table:
   ```

   Y agrega DESPUÉS de esa línea (antes del bloque de código):
   ```markdown
   ![Java Client Terminal Output](docimgs/java-client-terminal.png)
   ```

---

## 🎯 Resultado Final

Después de hacer esto, tu directorio `docimgs/` debería tener:

```
docimgs/
├── Albuaves - Sistema de Gestión de Aves-1.png  ✅ (ya existe)
├── api-browser-json.png                         ⬅️ NUEVA
├── java-client-terminal.png                     ⬅️ NUEVA
├── api-response-example.json                    ✅ (ya creada)
└── java-client-output.txt                       ✅ (ya creada)
```

---

## ✅ Verificación Final

Una vez que hayas agregado las capturas, ejecuta:

```bash
git add docimgs/
git commit -m "Agregar capturas de API y cliente Java para cumplimiento de requisitos"
git push
```

Y verifica que el README muestre correctamente las 3 capturas:
1. ✅ Interfaz web
2. ✅ API en navegador (JSON)
3. ✅ Cliente Java en terminal

---

## 📊 Puntuación Esperada

Con todas estas mejoras, tu proyecto debería obtener:

- **Parte 1 (Capturas en README): 3/3 pts** ✅
- **Parte 2 (README actualizado): 3/3 pts** ✅
- **Parte 3 (Tutorial-howto): 4/4 pts** ✅
- **TOTAL: 10/10 pts** 🎉
