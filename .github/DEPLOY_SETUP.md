# 🚀 Configuración de Deploy Automático

Este documento explica cómo configurar el deploy automático a tu servidor SSH usando GitHub Actions.

## ✅ Deploy Automático Configurado

Cada vez que hagas `git push` a la rama `main`, se ejecutarán automáticamente:

1. **Deploy a Render** (ya funciona automáticamente)
2. **Deploy al servidor SSH** (192.168.3.113) - necesita configuración inicial

---

## 🔐 Configurar Secretos en GitHub (Solo una vez)

Para que GitHub Actions pueda conectarse a tu servidor SSH, necesitas agregar 3 secretos:

### Paso 1: Generar clave SSH (si no tienes una)

En tu computadora local, ejecuta:

```bash
ssh-keygen -t rsa -b 4096 -C "github-actions@albuaves"
```

- Cuando pregunte la ubicación, usa: `~/.ssh/id_rsa_albuaves`
- NO pongas contraseña (déjalo vacío)

### Paso 2: Copiar la clave pública al servidor

```bash
ssh-copy-id -i ~/.ssh/id_rsa_albuaves.pub pau@192.168.3.113
```

### Paso 3: Probar la conexión

```bash
ssh -i ~/.ssh/id_rsa_albuaves pau@192.168.3.113
```

Si conecta sin pedir contraseña, ¡perfecto! ✅

### Paso 4: Agregar secretos en GitHub

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú izquierdo, click en **Secrets and variables** → **Actions**
4. Click en **New repository secret**

Agrega estos 3 secretos:

| Nombre del secreto | Valor |
|-------------------|-------|
| `SSH_PRIVATE_KEY` | El contenido completo del archivo `~/.ssh/id_rsa_albuaves` (toda la clave privada) |
| `SSH_HOST` | `192.168.3.113` |
| `SSH_USER` | `pau` |

#### Cómo copiar la clave privada:

```bash
cat ~/.ssh/id_rsa_albuaves
```

Copia TODO el output (desde `-----BEGIN OPENSSH PRIVATE KEY-----` hasta `-----END OPENSSH PRIVATE KEY-----`)

---

## 🎯 Cómo Usar

### Deploy automático (recomendado)

Simplemente haz push a GitHub:

```bash
git add .
git commit -m "Update albuaves"
git push
```

**¡Eso es todo!** GitHub Actions se encargará de:
- ✅ Subir archivos al servidor SSH
- ✅ Crear directorios necesarios
- ✅ Ejecutar migraciones de base de datos
- ✅ Reiniciar el servidor PHP

### Deploy manual (alternativa)

Si quieres hacer deploy manualmente, ejecuta:

```bash
./deploy-to-ssh.sh
```

---

## 🔍 Ver el Estado del Deploy

1. Ve a tu repositorio en GitHub
2. Click en la pestaña **Actions**
3. Verás los workflows en ejecución
4. Click en cualquier workflow para ver los detalles

---

## 🛠️ Troubleshooting

### Error: "Permission denied (publickey)"

**Solución:** Verifica que hayas copiado la clave pública al servidor:

```bash
ssh-copy-id -i ~/.ssh/id_rsa_albuaves.pub pau@192.168.3.113
```

### Error: "Host key verification failed"

**Solución:** Conéctate manualmente una vez para aceptar el fingerprint:

```bash
ssh pau@192.168.3.113
```

### El workflow falla pero el script local funciona

**Solución:** Asegúrate de que los secretos estén configurados correctamente en GitHub Settings.

### El servidor no se reinicia

**Solución:** Conéctate al servidor y verifica:

```bash
ssh pau@192.168.3.113
ps aux | grep "php -S"
tail -f ~/albuaves/server.log
```

---

## 📦 Archivos Importantes

- `.github/workflows/deploy-ssh.yml` - Workflow de GitHub Actions
- `deploy-to-ssh.sh` - Script de deploy manual
- `.github/DEPLOY_SETUP.md` - Este archivo

---

## 🎉 Resultado Final

Después de configurar todo:

1. **Render** → Deploy automático ✅
2. **SSH Server** → Deploy automático ✅
3. **Tu máquina local** → `./deploy-to-ssh.sh` funciona ✅

**¡Ya no necesitas hacer deploy manual nunca más!** 🚀
