# PLAN DE ASEGURAMIENTO DE LA CALIDAD DE SOFTWARE (SQA)
## ERP "FINCA LA PRIMAVERA" (ESTÁNDAR IEEE 730 / ISO/IEC/IEEE 25010)

**Proyecto:** Sistema Web ERP "Finca La Primavera" (Gestión Agropecuaria y Ganadera)  
**Versión del Plan:** 2.0  
**Estándar Base:** ISO/IEC/IEEE 25010 & IEEE 730  
**Tecnologías:** Node.js / Express, React, PostgreSQL 16, Sequelize, JWT, GitHub Actions  
**Autor:** Miguel Bojorge  
**Fecha:** 22 de Agosto, 2026  

---

## PARTE 1: MODELO GENERAL DE PLAN DE CALIDAD DE SOFTWARE

El Plan de Aseguramiento de la Calidad de Software (SQA) establece las directrices, estándares, métricas, revisiones y estrategia de pruebas necesarias para garantizar que el producto software entregado cumpla de forma rigurosa con los requisitos funcionales, no funcionales y regulatorios.

### Estructura Estándar del Plan
1. **Propósito y Alcance:** Objetivos del plan y fronteras del sistema a evaluar.
2. **Estructura Organizacional y Roles:** Definición de responsabilidades en calidad.
3. **Estándares y Normativas de Referencia:** Adherencia a ISO 25010, OWASP y normas del sector.
4. **Objetivos de Calidad y Métricas:** Criterios cuantitativos de aceptación del software.
5. **Actividades de Aseguramiento y Control de Calidad:** Revisiones estáticas, análisis estático y estrategia de pruebas en 6 fases.
6. **Gestión de Configuración y Control de Cambios:** Versionamiento, branching e integración continua.
7. **Gestión de Defectos e Incidentes:** Niveles de severidad y SLA de resolución.
8. **Herramientas de Apoyo:** Software para pruebas, automatización y telemetría.
9. **Criterios de Salida y Aprobación:** Requisitos para autorizar el paso a Producción.

---

## PARTE 2: PLAN DE CALIDAD DE SOFTWARE APLICADO AL ERP "FINCA LA PRIMAVERA"

### 1. Propósito y Alcance

#### 1.1 Propósito
Establecer las directrices, actividades de verificación y validación, controles de calidad y métricas objetivas para el desarrollo, pruebas e implementación del ERP **"Finca La Primavera"**, garantizando una plataforma agropecuaria segura, mantenible, de alta disponibilidad y con precisión transaccional en sus módulos operativos y financieros.

#### 1.2 Alcance
El presente plan abarca la totalidad de los módulos del ERP "Finca La Primavera":
* **Módulo de Ganadería Porcina:** Control de lotes, registro biológico, peso, traslados entre corrales y ciclo de engorde.
* **Módulo de Ganado Vacuno:** Gestión de bovinos, inventario de cabezas, registro sanitario y trazabilidad de potreros.
* **Control de Consumo de Alimentos y Medicinas:** Dosificación diaria por corral/lote y deducción automática de biomasa.
* **Módulo de Inventario y Bodega:** Gestión de insumos agrícolas/veterinarios, sacas de alimento, alertas de stock mínimo y reorden.
* **Módulo de Compras y Proveedores:** Gestión de proveedores, órdenes de compra y recepción de insumos.
* **Módulo de Ventas y Clientes:** Carrito de compras, facturación en PDF, catálogo de clientes y registro transaccional.
* **Módulo de Finanzas (P&L):** Dashboard de pérdidas y ganancias, ingresos por sector, balance de caja y cálculo de costos operativos.
* **Seguridad y Control de Acceso (RBAC):** Autenticación JWT y roles de usuario (`ADMIN`, `EMPLEADO`, `CLIENTE`).

---

### 2. Estructura Organizacional y Roles SQA

| Rol | Responsabilidad Principal en Calidad |
| :--- | :--- |
| **Gerente de QA / Calidad** | Aprobación final del Plan SQA, realización de auditorías de proceso CMMI/IEEE y reporte del estado de calidad a la alta dirección. |
| **Ingeniero de Automatización / QA Lead** | Diseñar y ejecutar planes de prueba funcionales, de integración, rendimiento (carga) y seguridad; mantener la suite en CI/CD. |
| **Líder Técnico / Arquitecto** | Revisión de la arquitectura modular (Node/Express + PostgreSQL 16), exigencia de principios SOLID, revisión de Pull Requests y análisis estático. |
| **Desarrollador Full Stack** | Construcción de pruebas unitarias (cobertura $\ge 80\%$), resolución de hallazgos/bugs y cumplimiento de la definición de "Hecho" (DoD). |
| **Product Owner / Administrador de la Finca** | Definición de criterios de aceptación del negocio agrícola/ganadero y validación de las Pruebas de Aceptación de Usuario (UAT). |

---

### 3. Estándares y Normativas de Referencia

1. **ISO/IEC/IEEE 25010:** Modelo de calidad del producto de software (Adecuación Funcional, Eficiencia de Rendimiento, Seguridad, Mantenibilidad, Usabilidad, Fiabilidad).
2. **IEEE 730:** Estándar internacional para Planes de Aseguramiento de Calidad de Software.
3. **OWASP Top 10 (2021/2026):** Estándar de seguridad web para prevenir Inyección SQL, XSS, CSRF, fallos de autenticación y control de acceso roto (RBAC).
4. **Normativas de Trazabilidad Agropecuaria y Leyes de Protección de Datos:** Garantía de privacidad en registros financieros y cumplimiento de normativas de control sanitario animal.

---

### 4. Objetivos de Calidad y Métricas (Basados en ISO 25010)

| Factor de Calidad | Objetivo Medible | Métrica / Criterio de Aceptación |
| :--- | :--- | :--- |
| **Adecuación Funcional** | 100% de las Historias de Usuario críticas del ERP aprobadas sin defectos bloqueantes. | Cobertura de pruebas sobre criterios de aceptación de HU $\ge 95\%$. |
| **Eficiencia de Rendimiento** | Tiempos de respuesta inmediatos en el campo y oficina administrativa. | Tiempo de respuesta en peticiones HTTP API $< 1.5$ segundos para el 90% de endpoints bajo carga normal. |
| **Seguridad** | Cero vulnerabilidades críticas o altas en el backend y base de datos. | Calificación 0 en vulnerabilidades Críticas/Altas en escaneos con OWASP ZAP y npm audit. |
| **Mantenibilidad** | Código limpio, modular y sostenible en el tiempo. | Cobertura de pruebas unitarias $\ge 80\%$; duplicación de código $< 3\%$ en SonarQube/ESLint. |
| **Usabilidad** | Alta facilidad de uso para capataces y vendedores desde tablets y celulares. | Puntuación SUS (*System Usability Scale*) $\ge 80/100$ en pruebas UAT. |
| **Fiabilidad** | Alta disponibilidad del servicio en producción (*Uptime*). | Disponibilidad del sistema $\ge 99.9\%$; Tiempo Medio Entre Fallos (MTBF) $> 120$ horas operativas continuas. |

---

### 5. Actividades de Aseguramiento y Estrategia de Pruebas por Fases (SDLC)

El ciclo de vida de desarrollo adopta una estrategia de pruebas integrada de 6 fases:

```
[1. Análisis y Requisitos] ➔ [2. Diseño y Arquitectura] ➔ [3. Desarrollo / Codificación] ➔ [4. Integración y Sistema] ➔ [5. Aceptación (UAT)] ➔ [6. Mantenimiento / Producción]
   (Revisión Estática SRS)     (Diseño DER / Prototipos)    (Pruebas Unitarias / API)     (E2E / Carga / OWASP)     (Validación en Campo)    (CI-CD / Telemetría)
```

#### FASE 1: Análisis y Requisitos (Pruebas Estáticas)
* **Enfoque:** Revisión estática de requerimientos para detectar ambigüedades, inconsistencias o vacíos de negocio agropecuario antes de programar.
* **Objeto de Prueba:** Historias de Usuario (HU) y Especificación de Requisitos de Software (SRS).
* **Criterio de Éxito:** Cobertura del 100% de reglas de negocio sin ambigüedades.

##### Casos de Prueba Estáticos (Ejemplo)
| ID | Requisito / Historia de Usuario | Verificación de Calidad | Resultado / Corrección |
| :--- | :--- | :--- | :--- |
| **CP-REQ-01** | Ambigüedad: *"El sistema debe permitir traslados de porcinos."* | No especifica si el corral de destino debe tener capacidad disponible ni si valida el estado sanitario. | **Ajuste:** Se precisa la regla: Un lote de cerdos solo puede ser trasladado a un corral cuyo espacio disponible sea mayor o igual al número de animales del lote y tenga estatus sanitario 'Habilitado'. |
| **CP-REQ-02** | Vacío Normativo: *"El sistema registrará las ventas y emitirá comprobantes."* | No especifica el formato de factura en PDF ni el cálculo legal de impuestos locales. | **Ajuste:** Se agrega requerimiento no funcional: El PDF debe cumplir con la estructura fiscal local, desglosando subtotal, IVA/impuestos y código único de factura. |

---

#### FASE 2: Diseño y Arquitectura
* **Enfoque:** Validación de prototipos UI/UX (pantallas en React), modelo de base de datos PostgreSQL (ERD) y arquitectura de seguridad JWT/API REST.
* **Objeto de Prueba:** Wireframes, Esquema de Base de Datos Sequelize/PostgreSQL y Diagrama de Arquitectura.
* **Criterio de Éxito:** Diseños *Responsive* adaptados a móviles de campo, integridad referencial y aislamiento RBAC.

##### Casos de Prueba de Diseño (Ejemplo)
| ID | Elemento a Evaluar | Prueba Diseñada | Criterio de Aceptación |
| :--- | :--- | :--- | :--- |
| **CP-DIS-01** | Protoboard UI/UX (React) | Simular la captura rápida de dosificación de alimentos desde un teléfono móvil de 6 pulgadas. | El capataz debe completar el registro de consumo diario en $\le 3$ toques táctiles sin necesidad de scroll horizontal. |
| **CP-DIS-02** | Modelo Entidad-Relación | Evaluar las relaciones entre `Porcinos`, `Corrales` y `ConsumoAlimento`. | Comprobar que la eliminación accidental de un registro de corral no borre en cascada el historial médico/biológico del cerdo (`ON DELETE RESTRICT`). |
| **CP-DIS-03** | Arquitectura de Seguridad | Revisar el flujo de autenticación y consumo de APIs. | Los clientes del frontend no se conectan directo a la base de datos; la comunicación se realiza exclusivamente vía REST con tokens Bearer JWT y HTTPS. |

---

#### FASE 3: Desarrollo / Codificación (Pruebas Unitarias y Métodos)
* **Enfoque:** Pruebas unitarias automatizadas escritas por los desarrolladores para validar la lógica pura de negocio en modelos, controladores y helpers.
* **Objeto de Prueba:** Servicios y Controladores de Node.js/Express (`porcinoController`, `ventaService`, `finanzaHelper`).
* **Criterio de Éxito:** Cobertura de código (*Code Coverage*) $\ge 80\%$.

##### Casos de Prueba Unitarios (Ejemplo en JavaScript / Jest)
```javascript
// CP-UNI-01: Cálculo de costo de venta de porcinos por peso y descuento
describe('Servicio de Ventas Agropecuarias - calcularTotalVenta()', () => {
  it('Debe calcular el precio total basado en peso total en kg y aplicar descuento de cliente preferencial', () => {
    const venta = { pesoTotalKg: 500, precioPorKg: 3.50, clientePreferencial: true, porcentajeDescuento: 10 };
    const resultado = VentaService.calcularTotalVenta(venta);
    
    // Subtotal: 500 * 3.50 = 1750. Descuento 10%: 175. Total: 1575
    expect(resultado.subtotal).toBe(1750);
    expect(resultado.montoDescuento).toBe(175);
    expect(resultado.totalNeto).toBe(1575);
  });

  it('No debe permitir registrar consumos de alimento con valores negativos o cero', () => {
    const consumoInvalido = { cantidadSacas: -5, fecha: '2026-08-22' };
    expect(() => ConsumoService.validarConsumo(consumoInvalido)).toThrow("La cantidad consumida debe ser mayor a cero");
  });
});
```

---

#### FASE 4: Integración y Sistema (E2E, Rendimiento y Seguridad)
* **Enfoque:** Pruebas End-to-End (E2E), carga masiva y seguridad web (OWASP Top 10 / RBAC) en entorno QA/Staging.
* **Objeto de Prueba:** Aplicación desplegada en entorno QA (Frontend + Backend + PostgreSQL 16).
* **Criterio de Éxito:** Integración sin fallas, tiempos $< 1.5$s, resistencia a 300 usuarios concurrentes y 0 vulnerabilidades.

##### Casos de Prueba de Sistema e Integración (Matriz CP-SIS)
| ID | Tipo de Prueba | Escenario de Prueba | Resultado Esperado |
| :--- | :--- | :--- | :--- |
| **CP-SIS-01** | Integración E2E | **Flujo Completo:** Registro de lechón $\rightarrow$ Asignación de Alimento $\rightarrow$ Venta a Cliente $\rightarrow$ Descuento en Inventario $\rightarrow$ Reflejo en Finanzas (P&L). | El expediente del lote y stock de alimentos se actualizan en PostgreSQL. La venta vincula el PDF y se refleja en el balance de pérdidas y ganancias en tiempo real. |
| **CP-SIS-02** | Seguridad (RBAC) | Intentar acceder a `/api/v1/finanzas/resumen` o `/api/v1/usuarios` autenticado con rol `"CLIENTE"`. | Middleware intercepta la petición y retorna **HTTP 403 Forbidden** (Acceso denegado). |
| **CP-SIS-03** | Carga / Rendimiento | Simular 300 usuarios concurrentes consultando stock de insumos y dashboard financiero a las 8:00 AM (k6 / JMeter). | 95% de peticiones responden en $< 1.5$ segundos con **0% de errores HTTP 500**. |
| **CP-SIS-04** | Seguridad OWASP | Inyección SQL y XSS en `/api/v1/productos` y registro de clientes. | `express-validator` y Sequelize parametrizado bloquean el intento retornando **HTTP 400 Bad Request**. |
| **CP-SIS-05** | Concurrencia | Dos ventas simultáneas de las últimas 10 sacas de alimento concentrado. | Transacción atómica (`transaction.atomic`): primera venta se procesa con éxito; la segunda falla por stock insuficiente (**HTTP 400**). |

---

#### FASE 5: Pruebas de Aceptación del Usuario (UAT)
* **Enfoque:** Validación directa por parte del personal real de la finca (Capataces, Vendedores, Administrador) en entorno de Pre-Producción.
* **Objeto de Prueba:** Entorno Pre-Producción con datos sintéticos y reales de Finca La Primavera.
* **Criterio de Éxito:** Firma del Acta de Aceptación UAT por los usuarios clave.

##### Casos de Prueba de Aceptación (Matriz UAT)
| Rol Usuario | Tarea de Prueba | Criterio de Aceptación del Usuario | Estado |
| :--- | :--- | :--- | :---: |
| **Capataz de Granja** | Registrar alimento, vacunas y traslados de porcinos desde el teléfono en la mañana. | *"Puedo registrar la comida y cambio de corral de los cerdos sin demorarme más de 2 minutos por galpón."* | **Aprobado** |
| **Encargado de Ventas** | Registrar venta de cerdos/vacunos, seleccionar cliente y descargar factura PDF. | *"El sistema procesa la venta, calcula precios por kilogramo y genera el PDF de factura de inmediato."* | **Aprobado** |
| **Administrador / Propietario** | Generar el reporte consolidado de Pérdidas y Ganancias (P&L) en PDF/Excel. | *"El informe financiero coincide exactamente con las facturas de venta cobradas y compras de inventario."* | **Aprobado** |

---

#### FASE 6: Mantenimiento y Producción
* **Enfoque:** Monitoreo continuo de errores, pruebas de regresión automáticas tras cada parche y verificación de *Uptime* ($\ge 99.9\%$).
* **Objeto de Prueba:** Entorno Real de Producción.

##### Estrategias de Mantenimiento / Producción
* **Pruebas de Regresión Automática (Sanity Check):** Suite en Cypress/Playwright ejecutada en GitHub Actions ante cada *push* a `main` para verificar login, registro de porcinos, flujo de ventas y dashboard P&L.
* **Pruebas de Sanidad Post-Despliegue (Smoke Testing):**
  - Comprobación de envío de alertas de stock mínimo por correo electrónico.
  - Verificación del pool de conexiones activas a PostgreSQL 16 y motor PDF.
* **Monitoreo Estático/Dinámico:** Uso de **Sentry** para excepciones frontend/backend en tiempo real, **Winston/Morgan** para logs de Express, y **PM2 Monitor** para memoria/CPU.

---

### 6. Gestión de Defectos e Incidentes

Los hallazgos detectados durante cualquier fase de pruebas se clasificarán y gestionarán según la siguiente escala de severidad y SLA:

| Severidad | Descripción | Tiempo Máximo de Solución (SLA) |
| :--- | :--- | :---: |
| **Bloqueante (Blocker)** | El sistema no permite iniciar sesión, falla la persistencia en PostgreSQL o impide procesar ventas/facturas. No hay alternativa. | **$< 4$ horas** |
| **Alta (Critical)** | El módulo de inventario calcula mal las sacas disponibles o no registra traslados, pero el resto de módulos funciona. | **$< 24$ horas** |
| **Media (Major)** | Error en la generación del PDF de reporte financiero o falla visual en un modal de porcinos. | **$< 3$ días** |
| **Baja (Minor)** | Texto desalineado, erratas en menús o detalles estéticos de UI en React. | **Próximo Sprint** |

---

### 7. Herramientas de Calidad Recomendadas

* **Gestión de Pruebas y Defectos:** GitHub Projects + Issues / Jira + Xray.
* **Análisis Estático de Código:** ESLint / SonarQube.
* **Pruebas Unitarias e Integración:** Jest / Supertest / Mocha (Node.js/Express).
* **Pruebas de API y E2E:** Postman / Cypress / Playwright.
* **Pruebas de Carga:** Apache JMeter / k6.
* **Seguridad:** OWASP ZAP / npm audit / Dependency-Check.
* **Monitoreo y Telemetría:** Sentry / Winston / PM2.

---

### 8. Criterios de Salida y Aprobación del Proyecto

El ERP "Finca La Primavera" se considerará oficialmente listo para el despliegue en el entorno de Producción únicamente cuando se cumplan las siguientes 5 condiciones:
1. **100% de los casos de prueba críticos y de alta prioridad** ejecutados y aprobados en QA.
2. **Cero (0) defectos abiertos** con severidad Bloqueante o Alta.
3. **Cobertura de pruebas unitarias $\ge 80\%$** en servicios y controladores.
4. **Informe de seguridad OWASP aprobado** sin hallazgos de impacto crítico o alto.
5. **Firma del Acta de Conformidad UAT** por parte del Administrador de la Finca y el Product Owner.
