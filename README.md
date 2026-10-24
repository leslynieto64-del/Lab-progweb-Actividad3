# Aplicación interactiva con JavaScript moderno

## Mi colección

**Laboratorio de Programación Web**
**Actividad 3. Aplicación interactiva con JavaScript moderno**

---

## Objetivo

Desarrollar una aplicación web del lado del cliente mediante JavaScript ES6+, manipulación del DOM, eventos, validación de datos y persistencia local.

## Situación de trabajo

Se necesita una herramienta web sencilla para administrar información sin depender todavía de un servidor. El usuario debe poder registrar, modificar y conservar datos entre sesiones.

## Descripción del proyecto
 
**Mi colección** es una aplicación web que permite llevar el registro de las series y películas que nos gustan, indicando si están en curso, pendientes o ya fueron terminadas. Para cada título, el usuario puede capturar el nombre, el tipo (serie o película), el género, el año de estreno y una valoración personal.
 
Los registros se muestran en la sección **Mi lista**, donde es posible buscar por título y filtrar por tipo, estado y género. También se pueden ordenar los resultados y limpiar los filtros para volver a ver todos los registros. Toda la información se guarda en el navegador mediante localStorage, por lo que se conserva al cerrar o recargar la página.
 
## Funcionalidades
 
- **Agregar registros:** formulario para registrar título, tipo, género, año de estreno, valoración personal y estado.
- **Visualizar registros:** los títulos guardados se muestran en la sección Mi lista.
- **Editar y eliminar registros:** se puede modificar la información de un título o borrarlo.
- **Validación de datos:** se revisa la información antes de guardarla y se muestran mensajes claros en caso de error.
- **Búsqueda por título:** permite encontrar rápidamente un registro.
- **Filtros por tipo, estado y género:** permiten ver solo los títulos que interesan.
- **Ordenamiento y limpieza de filtros:** permiten organizar la lista y volver a la vista completa.
- **Persistencia con localStorage:** los datos no se pierden entre sesiones.


## Tecnologías utilizadas

- **HTML5:** Fue utilizado para crear la estructura y organizar el contenido de la aplicación.
- **CSS3:** Se utilizó para darle diseño a la aplicación, como colores, tamaños, espacios y tipografía.
- **JavaScript ES6+:** Se utilizó para programar toda la lógica de la aplicación, usando `let` y `const`, template literals, arrow functions y métodos de arreglos.
- **Manipulación del DOM y eventos:** Se implementaron para actualizar la interfaz sin recargar la página y responder a las acciones del usuario.
- **localStorage:** Fue utilizado para guardar y recuperar la información entre sesiones.
- **DevTools:** Se utilizaron para probar y depurar el funcionamiento de la aplicación.
- **Git y GitHub:** Fueron utilizados para guardar y administrar los archivos de nuestro proyecto.

## Capturas de la aplicación

A continuación se muestran capturas de la aplicación en su versión para computadora y en dispositivos móviles.

### Vista en computadora

![Mi colección](<Capturas/Mi coleccion.png>)

### Vista en dispositivo móvil

![Mi colección móvil](<Capturas/Mi coleccion_mobil.png>)
