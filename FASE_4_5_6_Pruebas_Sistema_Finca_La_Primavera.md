# DOCUMENTACIÓN DE PRUEBAS DE SOFTWARE: ERP "FINCA LA PRIMAVERA"
## FASES 4, 5 Y 6: INTEGRACIÓN, ACEPTACIÓN (UAT) Y MANTENIMIENTO EN PRODUCCIÓN

**Proyecto:** ERP "Finca La Primavera" (Gestión Agropecuaria y Ganadera)  
**Dominio:** Sistema de Gestión de Porcinos, Vacunos, Inventario de Insumos, Ventas y Finanzas (P&L)  
**Tecnologías:** Node.js / Express, React, PostgreSQL 16, Sequelize / Django ORM, JWT, GitHub Actions  
**Autor:** Miguel Bojorge  
**Fecha:** 22 de Agosto, 2026  

---

## FASE 4: INTEGRACIÓN Y SISTEMA (E2E, RENDIMIENTO Y SEGURIDAD)

### 1. Enfoque y Objetivos de Prueba
* **Enfoque:** Pruebas funcionales de extremo a extremo (End-to-End - E2E), rendimiento bajo carga transaccional concurrente y seguridad web basada en los estándares OWASP Top 10 y Control de Acceso Basado en Roles (RBAC).
* **Objeto de Prueba:** Aplicación completa desplegada en entorno de QA / Staging (Frontend React + Backend Node.js/Express + Base de Datos PostgreSQL 16).
* **Criterios de Éxito:** 
  - Flujos integrados 100% operativos sin errores transaccionales ni inconsistencias en inventario/finanzas.
  - Tiempos de respuesta de la API $\le 1.5$ segundos bajo condiciones operativas normales.
  - $95\%$ de las peticiones atendidas con éxito bajo carga de 300 usuarios concurrentes sin caídas del servicio ($0\%$ errores HTTP 500).
  - Ausencia total de vulnerabilidades críticas y altas (Inyección SQL, XSS, Bypass de Autenticación RBAC).

---

### 2. Casos de Prueba de Sistema e Integración (Matriz CP-SIS)

| ID | Tipo de Prueba | Escenario de Prueba | Resultado Esperado |
| :--- | :--- | :--- | :--- |
| **CP-SIS-01** | **Integración E2E** | **Flujo Completo Operativo-Financiero:**<br>1. El Capataz registra un lote de lechones en `Porcinos` y asigna consumo de alimento diario en `ConsumoAlimento`.<br>2. El encargado de ventas registra una `Venta` asociando a un `Cliente`.<br>3. El sistema descuenta el producto/animal en `Inventario` y actualiza el Dashboard de `Finanzas` (P&L). | El expediente del lote y el stock de insumos se actualizan en tiempo real en PostgreSQL. La receta/factura queda vinculada de forma única con el ID de la venta y los ingresos/gastos se reflejan en el balance financiero en tiempo real. |
| **CP-SIS-02** | **Seguridad (RBAC)** | **Control de Acceso a Rutas Sensibles:**<br>Intentar acceder o enviar peticiones a la ruta sensible `/api/v1/finanzas/resumen` o `/api/v1/usuarios` utilizando un token JWT perteneciente a un usuario autenticado con el rol `"CLIENTE"` o sin token de autenticación. | El middleware de autenticación (`requireAuth`) intercepta la petición y retorna un código de estado **HTTP 403 Forbidden** (Acceso denegado) o **HTTP 401 Unauthorized** con el detalle `"Se requiere autenticación o permisos suficientes"`. |
| **CP-SIS-03** | **Carga / Rendimiento** | **Simulación de Carga Matutina (Hora Pico):**<br>Simular 300 usuarios concurrentes (operarios de campo, vendedores y administradores) intentando consultar la disponibilidad de insumos, registro de animales y el resumen de finanzas a las 8:00 AM mediante la herramienta JMeter/k6. | El 95% de las peticiones responden en menos de **1.5 segundos**, con un rendimiento de procesamiento estable y **0% de errores HTTP 500/503** (cero caídas del backend ni cuellos de botella en PostgreSQL). |
| **CP-SIS-04** | **Seguridad (OWASP - SQLi / XSS)** | **Validación de Inputs en Formularios y Filtros:**<br>Inyectar secuencias de caracteres maliciosos SQL (`' OR '1'='1`) y scripts XSS (`<script>alert(1)</script>`) en los parámetros de búsqueda de `/api/v1/productos` y en los campos del formulario de registro de clientes/porcinos. | La API sanitiza y valida los datos con `express-validator` y utiliza consultas parametrizadas a través del ORM (Sequelize/Django). Retorna **HTTP 400 Bad Request** sin ejecutar scripts ni exponer la estructura de la base de datos. |
| **CP-SIS-05** | **Integración Concurrente** | **Descuento Simultáneo de Stock (Race Condition):**<br>Dos vendedores intentan registrar simultáneamente el despacho de las últimas 10 sacas de alimento concentrado en la tabla `Productos`. | El sistema aplica transacciones atómicas (`transaction.atomic`) en PostgreSQL. La primera venta se procesa con éxito y la segunda rechaza la transacción informando stock insuficiente (**HTTP 400**), evitando saldos negativos. |

---

## FASE 5: PRUEBAS DE ACEPTACIÓN DEL USUARIO (UAT)

### 1. Enfoque y Criterios de Aprobación
* **Enfoque:** Pruebas funcionales y de usabilidad realizadas directamente por el personal operativo y administrativo de "Finca La Primavera" (Capataz/Operarios de Granja, Encargado de Ventas/Caja y Administrador General) para validar que el sistema responde a la operativa real del campo.
* **Objeto de Prueba:** Aplicación desplegada en un entorno de Pre-Producción / Staging cargado con datos simulados y representativos (lotes de cerdos, cabezas de ganado vacuno, insumos de bodega, clientes y proveedores).
* **Criterio de Éxito:** Aprobación formal del 100% de los escenarios UAT clave mediante la firma del **Acta de Entrega y Conformidad** por parte de la gerencia y jefes de área.

---

### 2. Casos de Prueba de Aceptación (Matriz UAT)

| Rol Usuario | Tarea de Prueba | Criterio de Aceptación del Usuario | Estado |
| :--- | :--- | :--- | :---: |
| **Capataz / Operario de Granja** | **Registrar alimento, vacunas y traslados:**<br>Registrar el consumo diario de alimento concentrado, dosificación de medicina y traslado de un lote de cerdos entre corrales durante la rutina de la mañana desde un dispositivo móvil/tablet. | *"Puedo registrar el consumo de alimentos, vacunas y el cambio de corral de los cerdos sin demorarme más de 2 minutos durante mi recorrido por las galpones."* | **Aprobado** |
| **Encargado de Ventas / Caja** | **Procesar venta y emitir factura PDF:**<br>Registrar una venta de ganado/productos, seleccionar o agregar cliente, procesar el pago en el carrito y descargar la factura en PDF. | *"El sistema me permite completar la venta rápidamente, calcula el total sin errores y genera la factura PDF descargable inmediatamente para entregar al comprador."* | **Aprobado** |
| **Administrador / Propietario** | **Generar reporte P&L y Balance Financiero:**<br>Generar y consultar el reporte mensual de Pérdidas y Ganancias (P&L), filtrado por categoría (Ganadería porcina vs Productos agrícolas) en formato PDF/Excel. | *"El archivo descargado y los gráficos del dashboard coinciden exactamente con el dinero cobrado en ventas y los gastos de insumos registrados en el módulo de inventario."* | **Aprobado** |
| **Encargado de Bodega / Inventario** | **Alertas de Stock Mínimo y Reorden:**<br>Verificar la notificación automática del sistema cuando un producto (ej. alimento o antibiótico) llega a su nivel mínimo de stock. | *"El sistema resalta en rojo los insumos escasos y me genera una sugerencia de orden de compra para el proveedor antes de que nos quedemos sin insumos."* | **Aprobado** |

---

## FASE 6: MANTENIMIENTO Y PRODUCCIÓN

### 1. Enfoque y Criterios de Operación
* **Enfoque:** Monitoreo continuo del rendimiento y errores en tiempo real, ejecución de pruebas de regresión automatizadas antes de desplegar parches o paradas de mantenimiento, y aseguramiento de la alta disponibilidad (*Uptime*).
* **Objeto de Prueba:** Sistema ERP "Finca La Primavera" en Entorno Real de Producción.
* **Criterio de Éxito:** 
  - Disponibilidad del sistema en producción $\ge 99.9\%$ (*Uptime*).
  - Detección proactiva de errores no controlados antes de que afecten la operativa del usuario.
  - Tiempo Medio de Reparación (MTTR) $< 2$ horas ante fallos críticos.

---

### 2. Estrategias y Casos de Prueba de Mantenimiento / Producción

#### A. Pruebas de Regresión Automática (Sanity Check / CI-CD)
* **Descripción:** Suite automatizada de pruebas con **Playwright / Cypress** y **Jest** que se ejecuta automáticamente en el pipeline de GitHub Actions tras cada actualización de código (*push* a la rama `main`) o parche de mantenimiento.
* **Verificaciones Clave:**
  1. **Autenticación:** Inicio de sesión correcto de usuarios con roles `ADMIN` y `EMPLEADO`.
  2. **Operativa de Granja:** Creación y edición de un registro de porcinos/vacunos.
  3. **Inventario y Ventas:** Agregar producto al carrito de compra, procesar venta y verificar deducción en stock.
  4. **Finanzas:** Renderización sin errores del gráfico de balance mensual.

#### B. Pruebas de Sanidad Post-Despliegue (Smoke Testing)
* **Verificaciones Inmediatas tras Despliegue:**
  1. **Envío de Alertas y Notificaciones:** Verificar que el servicio de correo/notificaciones envíe correctamente alertas de stock crítico al Administrador.
  2. **Persistencia y Conexión a PostgreSQL 16:** Probar la conexión activa con el pool de conexiones de la base de datos y la correcta lectura/escritura de datos.
  3. **Generación de Archivos y Reportes:** Validar la disponibilidad del motor de generación de reportes PDF (librerías de backend) en el servidor de producción.

#### C. Monitoreo Estático/Dinámico y Telemetría
* **Herramientas Utilizadas:** `Sentry` para captura de excepciones frontend/backend en tiempo real, `Morgan / Winston` para logging centralizado de peticiones HTTP en Node.js, y `Datadog / PM2 Monitor` para métricas de CPU y memoria.
* **Mecanismos de Control:**
  - Captura automática de errores 500 en el navegador de los administradores o dispositivos móviles de los operarios en la finca.
  - Alertamiento inmediato vía Email/Telegram al equipo de soporte técnico ante caídas del servidor o latencias superiores a 3.0 segundos.
