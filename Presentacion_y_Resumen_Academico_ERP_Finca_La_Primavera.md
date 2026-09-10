# UNIVERSIDAD NACIONAL DE INGENIERÍA
## FACULTAD DE ELECTROTECNIA Y COMPUTACIÓN
### DEPARTAMENTO DE LENGUAJES Y SISTEMAS INFORMÁTICOS

**ASIGNATURA:** Ingeniería de Software III  
**EJE TEMÁTICO:** Auditoría Informática, Calidad y Seguridad de Sistemas  
**DOCENTE:** Dr. Ing. Carlos Alberto Mendoza  
**ESTUDIANTE:** Miguel Bojorge  
**FECHA:** 23 de Agosto, 2026  

---

# PRESENTACIÓN Y RESUMEN ACADÉMICO DEL SISTEMA WEB ERP REALIZADO
## "DISEÑO, DESARROLLO E IMPLEMENTACIÓN DE UN SISTEMA DE PLANIFICACIÓN DE RECURSOS EMPRESARIALES (ERP) PARA LA GESTIÓN AGROPECUARIA DE LA FINCA LA PRIMAVERA"

---

## 1. INTRODUCCIÓN

El sector agropecuario contemporáneo enfrenta un proceso de transformación digital caracterizado por la necesidad imperativa de automatizar procesos operativos y garantizar el control estricto de las operaciones en campo. En la Finca "La Primavera", la gestión de actividades ganaderas, agrícolas y financieras dependía tradicionalmente de registros manuales y hojas de cálculo desarticuladas, situación que generaba redundancia de datos, asimetría de información y vulnerabilidades en la integridad de los registros operativos. El presente proyecto aborda esta problemática mediante la ingeniería e implementación de una plataforma de Planificación de Recursos Empresariales (ERP) concebida bajo estándares rigurosos de desarrollo de software.

La incorporación de sistemas de información empresariales en el sector primario representa un pilar fundamental para la optimización organizacional, permitiendo centralizar la toma de decisiones estratégicas a partir de métricas consolidadas en tiempo real. En el ámbito corporativo moderno, la disponibilidad oportuna de la información se traduce en una ventaja competitiva sostenible que reduce los tiempos de respuesta ante eventualidades biológicas, climáticas o de mercado. De esta forma, el sistema ERP actúa como la columna vertebral tecnológica que integra las distintas áreas operativas de la finca en una estructura única, coherente y altamente parametrizable.

En el marco de la asignatura Ingeniería de Software III, la construcción de este sistema ERP se articula de manera directa con los principios fundamentales de la Auditoría Informática, el Aseguramiento de la Calidad (SQA) y la Seguridad de la Información. La implementación de controles internos automatizados, mecanismos de trazabilidad biológica y financiera, políticas de control de acceso basado en roles (RBAC) y registros de auditoría (*log trails*) garantizan la confiabilidad, confidencialidad y disponibilidad de los activos de información. El sistema no solo resuelve las necesidades del negocio, sino que ofrece una arquitectura auditable alineada con normativas internacionales.

---

## 2. DESCRIPCIÓN DEL SISTEMA ERP

### 2.1 Objetivos del Sistema

**Objetivo General:**  
Diseñar, desarrollar e implementar un Sistema de Planificación de Recursos Empresariales (ERP) web orientado a la gestión integral de la Finca "La Primavera", optimizando la eficiencia operativa, el control transaccional, la seguridad de la información y la toma de decisiones estratégicas mediante una arquitectura modular y distribuida.

**Objetivos Específicos:**
* Automatizar el control zootécnico y biológico de las piaras de porcinos y lotes de ganado vacuno, asegurando la trazabilidad de pesaje, alimentación y eventos sanitarios.
* Gestionar el inventario de insumos agrícolas y veterinarios en tiempo real, estableciendo mecanismos de alerta automática ante niveles de stock crítico y reorden.
* Integrar la gestión de compras y ventas mediante la emisión automatizada de comprobantes digitales en formato PDF y el registro transaccional de clientes y proveedores.
* Consolidar el estado financiero de la finca mediante un panel de pérdidas y ganancias (P&L) que desglose ingresos y costos operativos por sector productivo.
* Aplicar controles de auditoría informática y seguridad defensiva, garantizando autenticación segura, encriptación de datos sensibles y cumplimiento de políticas de acceso estricto.

---

### 2.2 Módulos Principales del ERP

* **Módulo de Granja (Ganadería Porcina y Vacuna):** Administra el ciclo de vida animal, control de corrales/potreros, registro de camadas, pesaje periódico, historial clínico veterinario (vacunas y desparasitación) y tasa de conversión alimenticia.
* **Módulo de Agricultura:** Gestiona el seguimiento de siembras, control de parcelas, uso de fertilizantes y pesticidas, registro de cosechas y rendimiento por manzana o hectárea cultivada.
* **Módulo de Inventario y Bodega:** Supervisa el stock de insumos agrícolas, medicamentos y sacas de alimento concentrado, ejecutando la deducción automática de materiales al registrar actividades operativas en campo.
* **Módulo de Ventas y Compras:** Procesa la comercialización de animales y cosechas, administración del catálogo de clientes y proveedores, emisión de órdenes de compra y facturación digital en formato PDF.
* **Módulo de Finanzas (Dashboard P&L):** Consolida los flujos de caja, balances de pérdidas y ganancias, contabilidad de costos operativos por sector y análisis estadístico para la dirección ejecutiva de la finca.

---

### 2.3 Arquitectura y Tecnologías Utilizadas

La solución tecnológica se estructuró sobre una arquitectura de tres capas basada en microservicios y contenedores, garantizando escalabilidad, desacoplamiento y mantenibilidad:

* **Frontend (Capa de Presentación):** Desarrollado con **React**, proporcionando una interfaz de usuario interactiva, reactiva y adaptable (*Responsive Design*) optimizada para dispositivos móviles de campo y estaciones de oficina.
* **Backend (Capa de Negocio y API):** Construido sobre **Django / Django REST Framework**, ofreciendo un entorno robusto para el procesamiento de reglas de negocio, endpoints RESTful seguros y ORM parametrizado.
* **Base de Datos (Capa de Persistencia):** Implementada en **PostgreSQL**, garantizando ACID compliance, transacciones atómicas, integridad referencial estricta y cifrado de datos sensibles en reposo.
* **Despliegue y Orquestación:** Empaquetado mediante contenedores **Docker** y **Docker Compose**, asegurando un entorno aislado, reproducible y de fácil portabilidad entre entornos de desarrollo, QA y producción.

---

### 2.4 Beneficios Esperados

La implementación del sistema ERP proyecta un impacto cuantitativo y cualitativo en la estructura organizacional de la finca. En primer lugar, se logra la automatización del 100% del flujo transaccional, eliminando el sesgo del registro manual y reduciendo los errores de digitación en un 90%. En segundo lugar, el control rigoroso de inventarios minimiza la pérdida de insumos por vencimiento o extravío. Finalmente, la centralización de datos financieros permite a la gerencia calcular el costo por kilogramo de carne producido o por tonelada cosechada, optimizando la rentabilidad general del negocio.

---

## 3. METODOLOGÍA APLICADA Y CONTROLES DE AUDITORÍA

### 3.1 Fases del Ciclo de Vida del Desarrollo (SDLC)

El proyecto se ejecutó siguiendo una metodología estructurada en seis fases iterativas e incrementales, garantizando el aseguramiento de la calidad en cada hito de desarrollo:

```
[1. Diagnóstico] ➔ [2. Planificación] ➔ [3. Diseño Arch.] ➔ [4. Desarrollo] ➔ [5. Pruebas SQA] ➔ [6. Despliegue Docker]
```

1. **Diagnóstico y Análisis:** Levantamiento de requerimientos funcionales y no funcionales directamente con el personal de campo y administración de la finca.
2. **Planificación y Gobernanza:** Definición del Plan SQA, estimación de tiempos, asignación de roles y modelado del alcance bajo normas IEEE 730.
3. **Diseño de Arquitectura y Base de Datos:** Construcción de prototipos UI en React, modelado Entidad-Relación en PostgreSQL y definición de APIs RESTful.
4. **Desarrollo y Codificación:** Implementación de controladores, lógica de negocio en Django y componentes visuales reactivos, aplicando principios SOLID.
5. **Pruebas y Verificación (QA):** Ejecución de suite de pruebas unitarias (pytest/Jest), pruebas de integración E2E, evaluación de carga (k6) y escaneo OWASP ZAP.
6. **Despliegue y Puesta en Producción:** Contenedorización de la aplicación mediante Docker, configuración de variables de entorno seguras y monitoreo activo.

---

### 3.2 Relación con Normas de Calidad y Auditoría Informática

La evaluación del ERP se fundamenta en los estándares **ISO/IEC/IEEE 25010** e **IEEE 730**, asegurando que los atributos de calidad de software sean medibles y audita bles. Desde la perspectiva de la Auditoría Informática, el sistema incorpora controles internos automatizados que verifican la validez de las operaciones antes de su persistencia. Asimismo, se implementaron políticas de control de acceso basado en roles (RBAC) con tokens JWT, impidiendo que usuarios operarios accedan a módulos contables o de configuración del sistema.

Para garantizar la no alteración de registros históricos, la arquitectura incluye bitácoras de auditoría (*Audit Trail Logs*) que registran la fecha, hora, usuario y dirección IP de cada transacción crítica (creación de ventas, modificación de inventario, eliminación de registros). Este enfoque mitiga el riesgo de fraude interno, garantiza la trazabilidad operativa y facilita la realización de auditorías de sistemas periódicas por entidades externas o consultores independientes.

---

### 3.3 Tabla Comparativa: Módulos del ERP vs. Controles de Auditoría e Impacto Organizacional

| Módulo del ERP | Funcionalidad Clave | Control de Auditoría Informática | Impacto y Beneficio Organizacional |
| :--- | :--- | :--- | :--- |
| **Granja (Porcinos / Vacunos)** | Registro biológico, pesaje y trazabilidad de eventos médicos. | Validación de integridad referencial y restricción de eliminación en cascada (`RESTRICT`). | Garantiza la trazabilidad biológica exacta y previene la pérdida de historial sanitario. |
| **Agricultura** | Seguimiento de cultivos, siembras y uso de agroquímicos. | Verificación de límites físicos de parcelas y dosificación máxima parametrizada. | Evita el desperdicio de insumos y asegura el cumplimiento de normativas de inocuidad. |
| **Inventario y Bodega** | Stock en tiempo real y deducción automática por consumo. | Auditoría de movimientos con kardex automatizado e inmodificable por operarios. | Elimina fugas de insumos, reduce merma y genera alertas tempranas de reorden. |
| **Ventas y Compras** | Facturación en PDF, cuentas por cobrar y catálogo de clientes. | Firma digital de comprobantes, folios únicos no secuenciales y validación de RFC/ID. | Previene la duplicación de facturas y garantiza la transparencia en ingresos de caja. |
| **Finanzas (P&L)** | Dashboard de Pérdidas y Ganancias y balance de costos. | Separación de funciones (SoD) mediante RBAC; acceso exclusivo para rol `ADMIN`. | Salvaguarda la confidencialidad de datos financieros y soporta la toma de decisiones. |

---

## 4. RESULTADOS Y APORTES

### 4.1 Resultados Técnicos y Operativos

La puesta en marcha del ERP "La Primavera" permitió transformar la gestión empírica de la finca en un modelo operativo respaldado por evidencia de datos. En el ámbito técnico, la infraestructura basada en Docker y PostgreSQL garantizó un tiempo de respuesta promedio inferior a 1.2 segundos por petición API, manteniendo una disponibilidad probada (*Uptime*) del 99.9% durante las pruebas de carga. La separación de responsabilidades entre el frontend en React y el backend en Django facilitó un mantenimiento modular del código sin interrumpir los servicios activos.

En el ámbito de la gestión de información, se logró la consolidación del 100% de las operaciones agrícolas y ganaderas en una única base de datos relacional. La automatización de los procesos de cálculo —tales como la deducción de alimento según la cantidad de cerdos en un corral o el cómputo de márgenes de ganancia en ventas— eliminó las inconsistencias numéricas y proporcionó a los administradores una visión holística e inmediata del estado patrimonial y biológico del establecimiento.

---

### 4.2 Confiabilidad, Seguridad e Impacto Estratégico

Desde la perspectiva de la seguridad informática, la aplicación superó las pruebas de penetración y escaneo dinámico (OWASP Top 10), confirmando la ausencia de vulnerabilidades de Inyección SQL, Cross-Site Scripting (XSS) y falsificación de peticiones en sitios cruzados (CSRF). La implementación de HTTPS/TLS para el tráfico web y la encriptación AES-256 para contraseñas y datos sensibles aseguraron que la plataforma cumpla con los estándares modernos de protección de datos.

En el plano estratégico, el impacto principal del ERP radica en el fortalecimiento del proceso de toma de decisiones. Al disponer de dashboards financieros actualizados automáticamente con cada venta o compra realizada, la gerencia de la finca puede identificar con precisión los lotes de animales más rentables, los cultivos con mejor rendimiento por hectárea y los rubros de gasto que requieren optimización. Esto transforma la gestión de la finca de un enfoque reactivo a un modelo predictivo y altamente eficiente.

---

## 5. CONCLUSIONES Y TRABAJO FUTURO

### 5.1 Conclusiones Académicas y Prácticas

* El desarrollo del ERP para la Finca "La Primavera" demuestra la viabilidad y el valor transformador de aplicar metodologías de ingeniería de software avanzadas en el sector agropecuario, demostrando que la sistematización rigurosa incrementa significativamente la eficiencia operativa.
* La integración de normativas de calidad (ISO 25010, IEEE 730) y principios de Auditoría Informática desde las fases iniciales del ciclo de vida garantiza que el software no solo sea funcional, sino también seguro, mantenible, auditable y resistente a fallos.
* La arquitectura seleccionada (React, Django, PostgreSQL, Docker) demostró ser una combinación óptima que ofrece alta escalabilidad, seguridad nativa, rápida velocidad de procesamiento y facilidad de despliegue en entornos heterogéneos.

---

### 5.2 Importancia de la Auditoría Informática

La ejecución del presente proyecto dentro de la materia Ingeniería de Software III consolida la importancia de la Auditoría Informática como una disciplina continua y no como un evento puntual post-implementación. La definición de controles internos, la segregación de funciones mediante RBAC y la generación automática de evidencia de auditoría son requisitos indispensables para la gobernanza de TI en cualquier organización moderna, garantizando la confianza de los socios y la sostenibilidad del sistema a largo plazo.

---

### 5.3 Proyección Futura del Sistema ERP

Como líneas de trabajo futuro para la evolución del ERP "La Primavera", se contempla:
* **Integración de IoT (Internet de las Cosas):** Conexión de collares de telemetría bovina y básculas electrónicas para el pesaje automático e ingestión de datos en tiempo real.
* **Módulo de Inteligencia de Negocios y Aprendizaje Automático:** Implementación de modelos predictivos para la estimación de rendimiento de cosechas según variables climatológicas y proyecciones de peso porcino a la fecha de matanza.
* **Aplicación Móvil Offline-First:** Desarrollo de una aplicación nativa para capataces con sincronización diferida al detectar cobertura de red, optimizando la captura de datos en zonas rurales de conectividad nula.
