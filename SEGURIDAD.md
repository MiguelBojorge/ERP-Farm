# Seguridad — Finca La Primavera

Resumen de las medidas implementadas en la rama `feat/integracion-seguridad`.

## 1. Login y control de acceso
- Pantalla de login (`/login`) y sesión con JWT: access token de 30 min (en memoria) + refresh token de 7 días.
- **Toda la API exige sesión** salvo `POST /api/auth/login` y `POST /api/auth/refresh`.
- Roles: `ADMIN` (todo, incluye usuarios y eliminar), `EMPLEADO` (leer/crear/editar módulos operativos), `CLIENTE` (sin acceso al panel).
- Ya no existe registro público: solo un `ADMIN` crea cuentas. Nadie puede fijarse `isSuperuser`/`id` por la API.
- Un admin no puede borrarse, desactivarse ni dejar el sistema sin administradores.

## 2. Contraseñas
- Cifrado con **bcrypt** (costo 12, configurable con `BCRYPT_ROUNDS`); los hashes viejos se actualizan solos al iniciar sesión.
- Política: mínimo 8 caracteres, con letras y números.
- Mismo error y mismo tiempo de respuesta para "usuario inexistente" y "clave incorrecta".
- El seed ya no usa claves fijas: genera claves aleatorias (o usa `SEED_ADMIN_PASSWORD`, etc.) y las muestra una vez.
- Restablecer/crear admin: `npm run reset-password -- <usuario> [--crear-admin]` (dentro de `backend-node`).

## 3. Ataques a la base de datos (inyección)
- Sequelize envía los valores como **parámetros** (consultas preparadas); no hay SQL armado con texto del usuario.
- Capas extra: validación de tipos con `express-validator`, ids numéricos obligatorios (`:id`), campos protegidos (`id`, `createdAt`…) eliminados del cuerpo, claves `__proto__` descartadas, cuerpos limitados a 100 KB.
- Fuerza bruta: 5 intentos fallidos por IP+usuario cada 15 min (429) y tope general de 300 peticiones/min por IP.

## 4. CSRF
- Token firmado (HMAC-SHA256), ligado al usuario y con vencimiento. Se entrega en el login y en `GET /api/auth/csrf`.
- El frontend lo envía en `X-CSRF-Token` en cada POST/PATCH/PUT/DELETE; sin él (o con el de otro usuario) la API responde 403.
- Nota: como la sesión va en el header `Authorization` y no en cookies, el navegador no la adjunta solo; el token es una segunda barrera.

## 5. Copias de seguridad (PowerShell local)
Carpeta `scripts/`:

| Script | Qué hace |
|---|---|
| `backup-db.ps1` | `mysqldump` consistente → `.zip` + huella SHA-256 en `backups/`; borra copias de más de 14 días. Lee credenciales de `backend-node/.env`. |
| `restore-db.ps1 -BackupFile <zip>` | Verifica la huella, pide confirmación y restaura (usar `-Database` para probar en otra base). |
| `register-backup-task.ps1` | Programa el respaldo diario (02:00 por defecto) en el Programador de tareas. `-Unregister` lo quita. |

```powershell
.\scripts\backup-db.ps1
.\scripts\register-backup-task.ps1 -Time 02:00
.\scripts\restore-db.ps1 -BackupFile .\backups\<archivo>.zip -Database finca_prueba_restore
```
`backups/` está en `.gitignore` (contiene datos reales). Conviene copiar esa carpeta periódicamente a otro disco o nube.

## Limitaciones conocidas
- Cerrar sesión borra los tokens del navegador pero no los invalida en el servidor (JWT sin estado); expiran solos.
- Cambiar la contraseña no cierra otras sesiones abiertas hasta que venza su access token (30 min).
- El rate limit es en memoria (un solo proceso).
- `npm audit` aún marca 2 avisos moderados de `sequelize → uuid` cuyo arreglo es un cambio mayor de versión.
- En producción: usar HTTPS, `NODE_ENV=production` (exige secretos JWT largos y distintos) y migraciones en vez de `sync({ alter: true })`.
