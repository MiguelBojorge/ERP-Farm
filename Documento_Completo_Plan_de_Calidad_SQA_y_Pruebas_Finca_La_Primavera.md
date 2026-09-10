# GUÍA Y PLAN MAESTRO DE ASEGURAMIENTO DE LA CALIDAD DE SOFTWARE (SQA) Y PRUEBAS DEL SDLC
## SISTEMA WEB ERP "FINCA LA PRIMAVERA" (ESTÁNDAR IEEE 730-2014 / ISO/IEC/IEEE 25010)

**Proyecto:** Sistema Web ERP "Finca La Primavera" (Gestión Agropecuaria, Ganadera y Financiera)  
**Versión del Plan:** 2.0 (Completamente Integrado y Personalizado)  
**Estándar Base:** ISO/IEC/IEEE 25010:2011 & IEEE 730-2014  
**Arquitectura y Stack:** Node.js / Express, React, PostgreSQL 16, Sequelize ORM, JWT, GitHub Actions  
**Autor:** Miguel Bojorge  
**Fecha:** 22 de Agosto, 2026  

---

# SECCIÓN 1: PLAN DE ASEGURAMIENTO DE LA CALIDAD DE SOFTWARE (SQA)

## PARTE 1: Modelo y Estructura SQA Aplicado al ERP "Finca La Primavera"

El Plan de Aseguramiento de la Calidad de Software (SQA) para el **ERP "Finca La Primavera"** establece el marco metodológico, los estándares de ingeniería, las métricas objetivas, las revisiones estáticas y la estrategia de pruebas necesarias para garantizar que la plataforma cumpla con la totalidad de los requisitos funcionales del negocio ganadero y agrícola, así como con los atributos no funcionales de rendimiento, seguridad transaccional, usabilidad en el campo e integridad financiera.

### Estructura del Plan SQA Adaptada a la Finca
1. **Propósito y Alcance de SQA en la Finca:** Definición del objetivo de calidad y fronteras operativas del ERP (Porcinos, Vacunos, Inventario, Ventas, Finanzas P&L, Seguridad RBAC).
2. **Estructura Organizacional y Roles SQA:** Definición de responsabilidades técnicas y operativas del equipo para el control de calidad del software.
3. **Estándares y Normativas de Referencia:** Adherencia a ISO/IEC/IEEE 25010, IEEE 730-2014, OWASP Top 10 y normativas sanitarias/fiscales agropecuarias.
4. **Objetivos de Calidad y Métricas:** Cuantificación estricta de las metas de calidad bajo los factores de ISO 25010.
5. **Actividades de Aseguramiento y Control de Calidad:** Revisiones estáticas de requisitos (SRS), inspección de diseño de base de datos PostgreSQL, revisiones de código entre pares (Code Reviews), análisis estático automático y niveles de prueba.
6. **Gestión de Configuración y Control de Cambios:** Normas de versionamiento en Git (GitFlow), protección de la rama `main`, matriz de trazabilidad de requisitos (MTR) e integración continua.
7. **Gestión de Defectos e Incidentes:** Clasificación de hallazgos por nivel de severidad y tiempos máximos de respuesta (SLA).
8. **Herramientas de Apoyo del Stack Técnico:** Suite tecnológica utilizada para la automatización de pruebas, escaneo de seguridad y telemetría en producción.

---

## PARTE 2: Plan de Calidad de Software Aplicado al ERP "Finca La Primavera"

### 1. Propósito y Alcance

#### 1.1 Propósito
Establecer las directrices, actividades, controles de verificación/validación y métricas de calidad para el desarrollo e implementación del **ERP "Finca La Primavera"**, garantizando una plataforma web segura, mantenible, escalable, con alta disponibilidad y precisión en el control transaccional agropecuario y financiero.

#### 1.2 Alcance
El presente plan cubre la totalidad de los módulos que integran el sistema web del ERP "Finca La Primavera":
* **Módulo de Granja Porcina:** Control de lotes, registro biológico, peso promedio, traslados entre corrales, control de camada y ciclo de engorde.
* **Módulo de Ganado Vacuno:** Gestión de bovinos, inventario de cabezas, registro sanitario (vacunación/desparasitación) y rotación de potreros.
* **Control de Consumo de Alimentos y Medicinas:** Dosificación diaria por corral/lote y deducción automática de biomasa de inventario.
* **Módulo de Inventario y Bodega:** Gestión de insumos agrícolas/veterinarios, sacas de alimento concentrado, alertas de stock mínimo y reorden.
* **Módulo de Compras y Proveedores:** Gestión de proveedores, órdenes de compra y recepción de insumos en bodega.
* **Módulo de Ventas y Clientes:** Carrito de compras, facturación descargable en PDF, catálogo de clientes y registro transaccional.
* **Módulo de Finanzas (P&L):** Dashboard de pérdidas y ganancias, desglose de ingresos por sector (Ganadería vs Agricultura), balance de caja y cálculo de costos operativos.
* **Seguridad y Control de Acceso (RBAC):** Autenticación mediante tokens JWT y restricción de permisos por roles (`ADMIN`, `EMPLEADO`, `CLIENTE`).

---

### 2. Estructura Organizacional y Roles SQA

| Rol | Responsabilidad Principal en Calidad |
| :--- | :--- |
| **Gerente de QA / Calidad** | Aprobación final del Plan SQA, realización de auditorías de proceso (CMMI/IEEE) y reporte del estado de calidad a la alta dirección de la finca. |
| **Ingeniero de Automatización / QA Lead** | Diseño y ejecución de pruebas funcionales, de integración, rendimiento (carga con k6) y seguridad (OWASP); mantenimiento del pipeline en GitHub Actions. |
| **Líder Técnico / Arquitecto de Software** | Revisión de la arquitectura modular (Node.js/Express + PostgreSQL 16), exigencia de principios SOLID, revisión obligatoria de Pull Requests y análisis estático. |
| **Desarrollador Full Stack** | Construcción de pruebas unitarias con Jest ($\ge 80\%$ cobertura), corrección de hallazgos/bugs e integración continua en Git. |
| **Product Owner / Administrador de la Finca** | Definición de criterios de aceptación del negocio agrícola/ganadero y validación final en las Pruebas de Aceptación de Usuario (UAT). |

---

### 3. Estándares y Normativas de Referencia

1. **ISO/IEC/IEEE 25010:2011:** Modelo de calidad del producto de software aplicado al ERP (Adecuación Funcional, Eficiencia de Rendimiento, Seguridad, Mantenibilidad, Usabilidad, Fiabilidad).
2. **IEEE 730-2014:** Estándar internacional para los procesos de Aseguramiento de la Calidad de Software.
3. **OWASP Top 10 (2021/2026):** Estándar de seguridad web para prevenir Inyección SQL, XSS, CSRF, fallos de autenticación y control de acceso roto (RBAC) en el API REST.
4. **Normativas de Trazabilidad Agropecuaria y Leyes de Protección de Datos:** Cumplimiento de registros de control sanitario animal y confidencialidad en los balances financieros P&L.

---

### 4. Objetivos de Calidad y Métricas (Basados en ISO 25010)

| Factor de Calidad | Objetivo Medible | Métrica / Criterio de Aceptación |
| :--- | :--- | :--- |
| **Adecuación Funcional** | 100% de los requisitos críticos del ERP aprobados sin errores bloqueantes. | Cobertura de pruebas sobre criterios de aceptación de Historias de Usuario $\ge 95\%$. |
| **Eficiencia de Rendimiento** | Tiempos de respuesta óptimos bajo carga de trabajo normal en campo y oficina. | Tiempo de respuesta en peticiones web HTTP API $< 1.5$ segundos para 90% de los endpoints. |
| **Seguridad** | Cero vulnerabilidades críticas o altas en producción en el backend o base de datos. | Calificación 0 en vulnerabilidades Críticas/Altas en escaneo OWASP ZAP / SonarQube / npm audit. |
| **Mantenibilidad** | Código limpio, modular y bajo índice de deuda técnica. | Cobertura de pruebas unitarias $\ge 80\%$; Duplicación de código $< 3\%$ en ESLint/SonarQube. |
| **Usabilidad** | Alta facilidad de uso en el registro de campo (móviles/tablets) y en caja. | Puntuación SUS (*System Usability Scale*) $\ge 80/100$ en pruebas UAT con operarios y vendedores. |
| **Fiabilidad** | Alta disponibilidad del servicio ERP en producción (*Uptime*). | Disponibilidad del sistema $\ge 99.9\%$; Tiempo Medio Entre Fallos (MTBF) $> 120$ horas operativas continuas. |

---

### 5. Actividades de Aseguramiento y Control de Calidad

```
[Revisión Requisitos/Diseño] ➔ [Análisis Estático (ESLint/SonarQube)] ➔ [Pruebas Unitarias (Jest)] ➔ [Pruebas de Integración y API] ➔ [Pruebas UAT / Carga / Seguridad]
```

#### 5.1 Revisiones de Código y Análisis Estático
* **Revisiones entre Pares (Code Review):** Ningún código se integra a la rama principal (`main`) sin la aprobación de al menos un Líder Técnico o Peer Reviewer vía Pull Request en GitHub.
* **Análisis Estático Automático:** Ejecución automática de ESLint / SonarQube en el pipeline CI/CD de GitHub Actions para detectar *Code Smells*, duplicación de código y vulnerabilidades de seguridad antes de cada despliegue.

#### 5.2 Niveles y Estrategia de Pruebas

##### A. Pruebas Unitarias
* **Enfoque:** Cobertura de lógica de negocio pura en controladores y servicios de Node.js (cálculos de consumo de alimento por animal, precio de venta por peso en kg, retenciones de impuestos y deducción de biomasa).
* **Meta:** Cobertura mínima del 80% en el código de servicios y controladores backend.

##### B. Pruebas de Integración y API
* **Enfoque:** Validación de comunicación entre módulos internos (ej. ConsumoAlimento $\rightarrow$ Inventario $\rightarrow$ Finanzas) y servicios externos (emisión de facturas PDF, envío de correos).

##### C. Pruebas de Seguridad
* **Enfoque:** Pruebas de autenticación JWT (Bearer tokens), control de acceso basado en roles (RBAC: Empleado o Cliente no deben acceder a balances de finanzas ni gestión de usuarios) y encriptación de datos sensibles en tránsito (HTTPS/TLS) y en reposo (PostgreSQL 16 AES-256).

##### D. Pruebas de Carga y Rendimiento
* **Escenario:** Simulación de accesos masivos durante el registro matutino de alimentación o facturación en hora pico (300 usuarios concurrentes procesando marcajes o consultando reportes P&L mediante k6/JMeter).

##### E. Pruebas de Aceptación de Usuario (UAT)
* **Enfoque:** Validación directa con el personal operativo de "Finca La Primavera" (Capataces, Vendedores, Administrador) para confirmar que los flujos (registro de cerdos/vacunos, venta en caja, reporte financiero P&L) cumplen con la operación real de la finca.

---

### 6. Gestión de Defectos

Los hallazgos detectados durante las fases de pruebas se clasificarán y gestionarán según la siguiente escala de severidad y SLA de solución:

| Severidad | Descripción Aplicada al ERP "Finca La Primavera" | Tiempo Máximo de Solución |
| :--- | :--- | :---: |
| **Bloqueante (Blocker)** | El sistema no permite procesar ventas, se cae la base de datos PostgreSQL 16 o falla el inicio de sesión general. No hay alternativa operativa. | **$< 4$ horas** |
| **Alta (Critical)** | Módulo de inventario calcula mal las sacas de alimento disponibles o no registra traslados entre corrales, pero el resto del sistema funciona. | **$< 24$ horas** |
| **Media (Major)** | Error en la generación del archivo PDF de reporte financiero o falla visual en un modal de registro de porcinos. | **$< 3$ días** |
| **Baja (Minor)** | Texto desalineado, faltas de ortografía en menús del dashboard o detalles estéticos menores en la interfaz de React. | **Próximo Sprint** |

---

### 7. Herramientas de Calidad Recomendadas

* **Gestión de Pruebas y Defectos:** GitHub Projects + Issues / Jira + Xray / TestRail.
* **Análisis Estático de Código:** ESLint / SonarQube.
* **Pruebas Unitarias e Integración:** Jest / Supertest (Node.js/Express).
* **Pruebas de API y Funcionales:** Postman / Cypress / Playwright.
* **Pruebas de Carga:** Apache JMeter / k6.
* **Seguridad:** OWASP ZAP / npm audit / Dependency-Check.
* **Monitoreo y Telemetría:** Sentry / Winston / Morgan / PM2.

---

### 8. Criterios de Salida y Aprobación del Proyecto

El sistema **ERP "Finca La Primavera"** se considerará listo para el despliegue en el entorno de Producción únicamente cuando se cumplan las siguientes 5 condiciones obligatorias:
1. **100% de los casos de prueba críticos y de alta prioridad** ejecutados y aprobados en QA.
2. **Cero (0) defectos abiertos** con severidad Bloqueante o Alta.
3. **Cobertura de pruebas unitarias $\ge 80\%$** en el backend.
4. **Informe de seguridad OWASP aprobado** sin hallazgos de impacto crítico o alto.
5. **Firma de conformidad de la prueba UAT** por parte del Product Owner y el Administrador General de la Finca.

---

# SECCIÓN 2: PLAN DE PRUEBAS DETALLADO POR FASES DEL CICLO DE VIDA (SDLC)

A continuación se presenta la estructura de Plan de Pruebas adaptada a cada una de las 6 fases del ciclo de vida del desarrollo de software (SDLC) para el sistema web **ERP "Finca La Primavera"**.

---

## PARTE 1: Resumen de Fases y Tipos de Pruebas

```
[1. Análisis y Requisitos] ➔ [2. Diseño y Arquitectura] ➔ [3. Desarrollo / Codificación] ➔ [4. Integración y Sistema] ➔ [5. Aceptación (UAT)] ➔ [6. Mantenimiento / Producción]
   (Revisión Estática)        (Modelos / Seguridad)        (Pruebas Unitarias / API)       (End-to-End / Carga / Sec)    (Pruebas Funcionales en Finca)  (Monitoreo / Regresión)
```

---

## PARTE 2: Ejemplos de Planes de Pruebas por Fase (ERP Finca La Primavera)

### FASE 1: Análisis y Requisitos

* **Enfoque:** Pruebas estáticas (revisión de documentación de requerimientos para detectar ambigüedades, inconsistencias o vacíos legales/operativos antes de escribir una sola línea de código).
* **Objeto de prueba:** Historias de Usuario (HU) y Documento de Especificación de Requisitos (SRS) del ERP.
* **Criterio de éxito:** Cobertura total de reglas de negocio agropecuarias sin ambigüedades.

#### Casos de Prueba Estáticos (Matriz CP-REQ)

| ID | Requisito / Historia de Usuario | Verificación de Calidad | Resultado / Corrección |
| :--- | :--- | :--- | :--- |
| **CP-REQ-01** | **Ambigüedad detectada:**<br>*"El sistema debe permitir registrar traslados de porcinos."* | No especifica si valida la capacidad máxima del corral de destino ni si exige comprobar el estado sanitario de la piara. | **Ajuste:** Se precisa la regla de negocio: Un lote de cerdos solo puede ser trasladado a un corral cuyo espacio disponible sea $\ge$ número de cerdos a mover y posea estatus sanitario 'Habilitado'. |
| **CP-REQ-02** | **Vacío normativo:**<br>*"El sistema guardará el registro de ventas y facturación de la finca de forma segura."* | No especifica el nivel de cifrado de datos ni la estructura legal de comprobantes con impuestos desglosados. | **Ajuste:** Se agrega requerimiento no funcional: Cifrado de datos en reposo mediante AES-256 en PostgreSQL 16 y factura PDF con subtotal, impuestos locales y código único de control. |
| **CP-REQ-03** | **Inconsistencia de negocio:**<br>*"El sistema emitirá alertas de reorden de alimento."* | No especifica el umbral dinámico ni si considera la tasa de consumo diario según el número de animales en granja. | **Ajuste:** Se precisa regla: La alerta de stock mínimo se calculará multiplicando el consumo promedio diario de la biomasa actual por 7 días de reserva. |

---

### FASE 2: Diseño y Arquitectura

* **Enfoque:** Validación de prototipos de interfaz (UI/UX en React), diagramas de base de datos (DER en PostgreSQL 16 con Sequelize) y diseño de la arquitectura de seguridad/API.
* **Objeto de prueba:** Wireframes / Prototypes en React, Esquema de Base de Datos PostgreSQL 16 y Diagrama de Arquitectura REST.
* **Criterio de éxito:** Diseños adaptativos (Responsive) para teléfonos de campo, integridad referencial y aislamiento de roles (RBAC).

#### Casos de Prueba de Diseño (Matriz CP-DIS)

| ID | Elemento a Evaluar | Prueba Diseñada | Criterio de Aceptación |
| :--- | :--- | :--- | :--- |
| **CP-DIS-01** | Protoboard UI / UX | Simular el flujo de registro rápido de alimento y medicinas desde un teléfono móvil de 6 pulgadas en los galpones. | El capataz u operario debe completar el registro de consumo diario en $\le 3$ clics sin requerir scroll horizontal. |
| **CP-DIS-02** | Modelo Entidad-Relación | Evaluar las relaciones entre `Porcinos`, `Corrales` y `ConsumoAlimento` en PostgreSQL 16. | Comprobar que la eliminación accidental de un registro de corral no borre en cascada el historial biológico/médico del cerdo (`ON DELETE RESTRICT`). |
| **CP-DIS-03** | Arquitectura de Seguridad | Revisar el diagrama de red y componentes para el portal de usuarios y clientes. | Comprobar que los clientes no tengan acceso directo a la base de datos PostgreSQL 16; la interacción se realiza únicamente vía API REST protegida con middleware JWT. |

---

### FASE 3: Desarrollo / Codificación (Unitaria y Métodos)

* **Enfoque:** Pruebas unitarias automatizadas desarrolladas por los programadores para validar componentes individuales, métodos aislados y endpoints API internos.
* **Objeto de prueba:** Módulos de código (Servicios, Controladores, Helpers de Lógica de Negocio).
* **Criterio de éxito:** Cobertura de código (*Code Coverage*) $\ge 80\%$.

#### Casos de Prueba Unitarios (Ejemplo en JavaScript / Jest)

```javascript
// CP-UNI-01: Cálculo de costo de venta porcina por peso total en kg y descuento de cliente preferencial
describe('Servicio de Ventas Agropecuarias - calcularTotalVenta()', () => { 
  it('Debe aplicar el precio por kg y descontar el porcentaje de cliente preferencial', () => { 
    const venta = { pesoTotalKg: 200, precioKg: 3.50, esClientePreferencial: true, descuentoPorcentaje: 10 }; 
    const resultado = VentaService.calcularTotalVenta(venta); 
    
    // Subtotal: 200 * 3.50 = 700. Descuento 10%: 70. Total: 630
    expect(resultado.subtotal).toBe(700); 
    expect(resultado.montoDescuento).toBe(70); 
    expect(resultado.totalNeto).toBe(630);
  }); 

  it('No debe permitir registrar consumos de alimentos o traslados con fechas futuras', () => { 
    const fechaFutura = '2030-01-01'; 
    expect(() => ConsumoService.validarFecha(fechaFutura)).toThrow("Fecha de registro inválida"); 
  }); 
});
```

---

### FASE 4: Integración y Sistema (E2E, Rendimiento y Seguridad)

* **Enfoque:** Pruebas funcionales de extremo a extremo (End-to-End), rendimiento bajo carga transaccional concurrente y seguridad web (OWASP Top 10 / RBAC).
* **Objeto de prueba:** Aplicación desplegada en entorno de QA / Staging (Frontend React + Backend Node.js/Express + Base de Datos PostgreSQL 16).
* **Criterio de éxito:** Flujos integrados sin errores, tiempos de respuesta aceptables ($\le 1.5$s) y ausencia de vulnerabilidades.

#### Casos de Prueba de Sistema e Integración (Matriz CP-SIS)

| ID | Tipo de Prueba | Escenario de Prueba | Resultado Esperado |
| :--- | :--- | :--- | :--- |
| **CP-SIS-01** | Integración E2E | **Flujo completo:** Recepción/Capataz registra lote porcino $\rightarrow$ Asigna alimento en `ConsumoAlimento` $\rightarrow$ Vendedor procesa `Venta` $\rightarrow$ Bodega descuenta `Inventario` $\rightarrow$ Dashboard muestra actualización en `Finanzas`. | El expediente del lote y stock de alimentos se actualizan en PostgreSQL. La venta vincula el PDF único y el gasto/ingreso queda reflejado en el balance P&L en tiempo real. |
| **CP-SIS-02** | Seguridad (RBAC) | Intentar acceder a la ruta `/api/v1/finanzas/resumen` o `/api/v1/usuarios` autenticado con el rol `"CLIENTE"`. | Middleware intercepta la petición y retorna **HTTP 403 Forbidden** (Acceso denegado). |
| **CP-SIS-03** | Carga / Rendimiento | Simular 300 usuarios concurrentes intentando consultar disponibilidad de inventario y reporte financiero a las 8:00 AM (hora pico de matanza/despacho). | El 95% de las peticiones responden en menos de **1.5 segundos** sin caídas del servicio (**0% errores HTTP 500**). |
| **CP-SIS-04** | Seguridad OWASP | Inyectar SQLi (`' OR '1'='1`) y scripts XSS en la búsqueda de `/api/v1/productos` y registro de clientes. | `express-validator` y Sequelize parametrizado bloquean el intento retornando **HTTP 400 Bad Request**. |
| **CP-SIS-05** | Concurrencia | Dos ventas simultáneas de las últimas 10 sacas de alimento concentrado en bodega. | Transacción atómica en PostgreSQL: primera venta se procesa con éxito; la segunda falla por stock insuficiente (**HTTP 400**). |

---

### FASE 5: Pruebas de Aceptación del Usuario (UAT)

* **Enfoque:** Pruebas realizadas por los usuarios finales reales (Administrador/Propietario, Capataces de Granja, Vendedores/Caja, Bodegueros) para validar la usabilidad y la alineación con la operación diaria de la finca.
* **Objeto de prueba:** Aplicación desplegada en un entorno de Pre-Producción con datos simulados y reales representativos.
* **Criterio de éxito:** Aprobación formal mediante acta de entrega por parte del personal operativo y administrativo.

#### Casos de Prueba de Aceptación (Matriz UAT)

| Rol Usuario | Tarea de Prueba | Criterio de Aceptación del Usuario | Estado |
| :--- | :--- | :--- | :---: |
| **Capataz / Operario de Granja** | Registrar la dosificación de alimento, tratamiento veterinario y cambio de corral durante la jornada matutina. | *"Puedo registrar el consumo de alimentos, vacunas y traslados sin demorarme más de 2 minutos por galpón desde el teléfono móvil."* | **Aprobado** |
| **Encargado de Ventas / Caja** | Procesar la venta de cerdos o productos agrícolas, seleccionar cliente y descargar la factura PDF. | *"El sistema me permite registrar la venta rápidamente, calcula el total sin errores y genera la factura PDF descargable inmediatamente."* | **Aprobado** |
| **Administrador / Propietario** | Generar el reporte mensual de pérdidas y ganancias (P&L) por categoría en formato PDF/Excel. | *"El archivo descargado y los gráficos coinciden exactamente con las ventas cobradas y las compras de insumos del inventario."* | **Aprobado** |
| **Encargado de Bodega / Inventario** | Verificar la alerta de stock mínimo de alimento concentrado y generación de orden de compra. | *"El sistema resalta los productos por agotarse y genera una propuesta de orden de compra sin inconsistencias."* | **Aprobado** |

---

### FASE 6: Mantenimiento y Producción

* **Enfoque:** Monitoreo continuo de errores, pruebas de regresión automatizadas tras cada parche/actualización y verificación de disponibilidad (*Uptime*).
* **Objeto de prueba:** Sistema ERP "Finca La Primavera" en Entorno Real de Producción.
* **Criterio de éxito:** Disponibilidad del sistema $\ge 99.9\%$, detección temprana de errores no controlados y MTTR $< 2$ horas.

#### Casos de Prueba de Mantenimiento / Producción (Ejemplos)

* **Pruebas de Regresión Automática (Sanity Check):** Suite automatizada con **Cypress / Playwright** que se ejecuta en GitHub Actions tras cada despliegue de mantenimiento para verificar que las funciones críticas (Inicio de sesión, Registro de porcinos/vacunos, Venta en caja, Reportes P&L) sigan funcionando correctamente.
* **Pruebas de Sanidad Post-Despliegue (Smoke Testing):**
  * Verificar el envío correcto de alertas de stock mínimo de alimento por correo electrónico.
  * Verificar conexión activa con el pool de PostgreSQL 16 y el servicio de generación de comprobantes PDF.
* **Monitoreo Estático/Dinámico:** Uso de herramientas de telemetría (**Sentry**, **Morgan/Winston**, **PM2 Monitor**) para capturar excepciones en tiempo real producidas en el navegador o dispositivos móviles de los operarios y administradores.
