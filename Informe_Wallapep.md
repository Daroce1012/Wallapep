# Informe de Análisis de Usabilidad - Wallapep

## 1. Puntos Implementados y su Justificación

**1) Usuario permitir crearlo con todos los campos que hay en la base de datos, actualmente hay varios que no se están usando, algunos campos no son obligatorios.**

*   **Implementación:** El formulario de creación de usuario en `CreateUserComponent.js` ha sido ampliado para incluir todos los campos de la base de datos. Se han añadido validaciones en `UtilsValidations.js` y el `userRepository.js` maneja el guardado de estos nuevos campos, permitiendo algunos como no obligatorios.
*   **Ubicación del código:**
    *   `wallapep/src/pages/components/user/CreateUserComponent.js`
    *   `wallapep/src/utils/UtilsValidations.js`
    *   `backend-wallapep-main/app/repositories/userRepository.js`

**2) Usar las categorías de los productos.**
    *   **Introducir 7 categorías hardcodeadas (en la aplicación React), el usuario debe seleccionar una de ellas al crear producto.**
    *   **Al crear un producto se debe elegir la categoría a la que pertenece.**
*   **Implementación:** Las 7 categorías están definidas en `UtilsCategories.js`. Al crear un producto, el componente `CreateProductComponent.js` presenta un `Select` para que el usuario elija una de estas categorías. Esta selección se envía con los datos del producto.
*   **Ubicación del código:**
    *   `wallapep/src/utils/UtilsCategories.js`
    *   `wallapep/src/pages/components/products/CreateProductComponent.js`

**3) Hacer una página principal para el sitio.**
    *   **Explicar brevemente para que sirve la aplicación.**
    *   **Debe mostrar las categorías y los productos que se venden en cada categoría.**
*   **Implementación:** La página principal (`index.js`) utiliza `HeroSection.js` para la descripción de la aplicación y `CategoriesSection.js` para mostrar las categorías con sus productos asociados, ofreciendo una visión general de la oferta.
*   **Ubicación del código:**
    *   `wallapep/src/pages/index.js`
    *   `wallapep/src/pages/components/home/HeroSection.js`
    *   `wallapep/src/pages/components/home/CategoriesSection.js`

**4) Buscador en la lista de productos, que permita buscar/filtrar por categoría, título, precio (indicando un precio mayor y menor).**
    *   **Los campos de búsqueda/filtrado tienen que poder funcionar de forma combinada).**
    *   **Hacer este filtrado en el frontend desde la aplicación React.**
*   **Implementación:** `ProductFiltersComponent.js` gestiona los filtros por categoría, título, precio mínimo y máximo. El `ListProductsComponent.js` aplica estos filtros combinados a la lista de productos en el frontend, actualizando la visualización dinámicamente.
*   **Ubicación del código:**
    *   `wallapep/src/pages/components/products/ProductFiltersComponent.js`
    *   `wallapep/src/pages/components/products/ListProductsComponent.js`

**5) Datos de compra/transacciones, permitir registrar:**
    *   **POST /transactions permite registrar una transacción (es una compra de un producto).**
*   **Implementación:** La lógica para registrar transacciones se encuentra en `transactionService.js` en el backend, que es llamado por `transactionController.js`. Este servicio recibe los datos del producto y el comprador para crear un nuevo registro de transacción en la base de datos a través de `transactionRepository.js`.
*   **Ubicación del código:**
    *   `backend-wallapep-main/app/services/transactionService.js`
    *   `backend-wallapep-main/app/controllers/transactionController.js`
    *   `backend-wallapep-main/app/repositories/transactionRepository.js`

**6) Ver transacciones propias.**
    *   **Incluir una vista donde el usuario pueda ver en una tabla todas las transacciones en las que ha participado.**
    *   **Si toda la información no está en la tabla realizar una vista de detalles de las transacciones.**
*   **Implementación:** La vista `ListMyTransactionsComponent.js` muestra una tabla con las transacciones del usuario. Para detalles adicionales, cada fila de la tabla tiene un enlace a `DetailsTransactionComponent.js`, que presenta la información completa de una transacción específica.
*   **Ubicación del código:**
    *   `wallapep/src/pages/myTransactions.js` (Página de la vista)
    *   `wallapep/src/pages/components/transactions/ListMyTransactionsComponent.js`
    *   `wallapep/src/pages/detailTransaction/[id].js` (Página de la vista de detalle)
    *   `wallapep/src/pages/components/transactions/DetailsTransactionComponent.js`

**7) Poder ver los perfiles de usuario, se incluirán enlaces a los perfiles de los usuarios desde:**
    *   **Los productos (perfil del usuario que lo vende).**
    *   **Las transacciones, perfil de los usuarios implicados en la transacción.**
    *   **El perfil muestra:**
        *   **i. Los datos públicos del usuario GET /users/<id>**
        *   **ii. Las transacciones que ha realizado GET /transactions/public?sellerId=<id> o GET /transactions/public?buyerId=<id>**
        *   **iii. Productos en venta GET /products?sellerId=<id>**
*   **Implementación:** Los enlaces a perfiles de usuario se encuentran en `ProductCard.js` (para el vendedor) y en `ListMyTransactionsComponent.js` (para los usuarios de la transacción). La página `UserProfileComponent.js` muestra los datos públicos del usuario, sus productos en venta (obtenidos con `productsService.js`) y sus transacciones (obtenidas con `transactionService.js`).
*   **Ubicación del código:**
    *   `wallapep/src/pages/components/common/ProductCard.js`
    *   `wallapep/src/pages/components/transactions/ListMyTransactionsComponent.js`
    *   `wallapep/src/pages/profile.js` (Página de la vista de perfil propio)
    *   `wallapep/src/pages/user/[id].js` (Página de la vista de perfil de otros usuarios)
    *   `wallapep/src/pages/components/profile/UserProfileComponent.js`
    *   `backend-wallapep-main/app/services/productsService.js`
    *   `backend-wallapep-main/app/services/transactionService.js`

---

## 2. Introducción

Este informe presenta un análisis exhaustivo de la usabilidad del sitio web Wallapep, evaluando diferentes aspectos de la interfaz de usuario y la experiencia del usuario. El objetivo es identificar las fortalezas y posibles áreas de mejora de la aplicación web, basándose en la encuesta proporcionada.

## 3. Análisis Detallado por Sección

### 3.1. Creación de Cuenta de Usuario

*   **Pregunta 1.a: ¿Es ágil seleccionar el país?, puedo tanto comenzar a escribir y filtrar en una lista como seleccionar directamente de la lista.**
    *   **Respuesta:** Sí, la selección del país es ágil. El componente `Select` de Ant Design utilizado en `wallapep/src/pages/components/user/CreateUserComponent.js` (`línea 203`) tiene las propiedades `showSearch` y `filterOption` habilitadas. Esto permite al usuario tanto escribir para filtrar la lista de países como seleccionar directamente de la lista. Además, la propiedad `allowClear` facilita la eliminación de la selección.

### 3.2. Creación de Productos

*   **Pregunta 2.a: ¿Sí introduzco un producto con muy poca o mucha información se descuadran los layouts de la página que muestran ese producto?**
    *   **Respuesta:** El sistema maneja bien la **poca información** sin descuadrar los layouts, usando placeholders para imágenes (en `wallapep/src/pages/components/common/ProductCard.js`, `líneas 23-33`) y mostrando descripciones condicionalmente.
    *   Para el caso de "mucha información", específicamente títulos y descripciones muy largas en las tarjetas de producto (`wallapep/src/pages/components/common/ProductCard.js`), el CSS `wallapep/src/styles/ProductCard.module.css` no implementa un truncamiento explícito (`text-overflow: ellipsis;` o `max-height` con `overflow: hidden;`). Esto significa que, si un título o una descripción son excesivamente largos, podrían hacer que las tarjetas se expandan verticalmente. En la página de detalles del producto (`wallapep/src/pages/components/products/DetailsProductComponent.js`), las descripciones largas se ajustan correctamente dentro de su contenedor gracias a `word-break: break-word;` en `wallapep/src/styles/DetailsProduct.module.css` (`líneas 74-75`).

### 3.3. Tablas de Productos, Transacciones y Ofertas Recibidas

*   **Pregunta 3.a: ¿Las tablas tienen filtrado y ordenado por los campos relevantes?**
    *   **Respuesta:** Sí, ambas tablas (`wallapep/src/pages/components/products/ListMyProductsComponent.js` y `wallapep/src/pages/components/transactions/ListMyTransactionsComponent.js`) tienen capacidades de filtrado y ordenado.
    *   En "Mis Productos": ordenado por "Title", "Price (€)", "Date"; filtrado por "Title" y "Status" (`líneas 129, 160, 192` y `líneas 130, 177`).
    *   En "Mis Transacciones": ordenado por "Product", "Price (€)", "Date"; filtrado por "Product", "Category" y "Role" (`líneas 311, 373, 421` y `líneas 313, 339, 387`).
*   **Pregunta 3.b: ¿Se ha destacado visualmente alguna propiedad especialmente relevante de cada elemento?**
    *   **Respuesta:** Sí, se han destacado visualmente propiedades relevantes.
    *   En "Mis Productos": el "Status" se muestra con etiquetas de colores (rojo para "Sold", verde para "Available") (`líneas 183-185`).
    *   En "Mis Transacciones": el "Price (€)" se muestra en negrita y color azul (`línea 375`), y el "Role" se muestra con etiquetas de colores (azul para "Buyer", verde para "Seller") (`líneas 406-407`). Los títulos de productos y nombres de usuarios son enlaces.
*   **Pregunta 3.c: ¿Se ofrece la posibilidad de editar directamente algún campo que suela ser cambiado de manera frecuente?, por ejemplo, el precio de un producto.**
    *   **Respuesta:** Sí, en la tabla de "Mis Productos" (`ListMyProductsComponent.js`), se ofrece la posibilidad de editar directamente el precio de un producto a través del componente `PriceEditor` (`líneas 161-172`).
    *   En la tabla de "Mis Transacciones", no se observa una funcionalidad similar de edición directa de campos.
*   **Pregunta 3.d: ¿Se adapta la tabla a pantallas pequeñas de ordenador?**
    *   **Respuesta:** Sí, ambas tablas utilizan la propiedad `scroll={{ x: true }}` (`línea 301` en `ListMyProductsComponent.js` y `línea 557` en `ListMyTransactionsComponent.js`), lo que permite el desplazamiento horizontal si el contenido excede el ancho de la pantalla, evitando descuadres.
*   **Pregunta 3.e: ¿Tienen un resumen que pueda resultar útil? Como cuándos productos he comprado y vendido en el último mes, cuando dinero he ganado, etc…**
    *   **Respuesta:** Sí, ambas páginas con tablas incluyen un `StatisticsCard` (`wallapep/src/pages/components/common/StatisticsCard.js`) que proporciona resúmenes útiles.
    *   En "Mis Productos": muestra "Total Products", "Sold" y "Available" (`líneas 228-246`).
    *   En "Mis Transacciones": muestra "Total Earned", "Total Spent" y "Total Transactions" (`líneas 78-140`).
    *   Estos resúmenes son generales y no incluyen métricas específicas "en el último mes".

### 3.4. Listado de Productos (como comprador)

*   **Pregunta 4.a: ¿ofrezco un mecanismo de búsqueda o filtrado adecuado para el tipo de página?**
    *   **Respuesta:** Sí, la página de listado de productos (`wallapep/src/pages/components/products/ListProductsComponent.js`) ofrece un mecanismo de búsqueda y filtrado completo a través de `wallapep/src/pages/components/products/ProductFiltersComponent.js`. Incluye filtros por categoría, título, precio mínimo y precio máximo.
*   **Pregunta 4.b: ¿es posible saber el número de productos de cada categoría antes de realizar una búsqueda sobre ella?**
    *   **Respuesta:** Sí, pero esta información se presenta en la `CategoriesSection` (`wallapep/src/pages/components/home/CategoriesSection.js`, `líneas 46-51`) (probablemente en la página de inicio), donde cada categoría muestra un `Tag` con el recuento de productos. No se muestra directamente en el `Select` de filtros en la página de listado de productos.
*   **Pregunta 4.c: ¿ofrezco la posibilidad de eliminar de manera sencilla los filtros de una búsqueda?**
    *   **Respuesta:** Sí, el `ProductFiltersComponent.js` incluye un botón "Clear Filters" (`líneas 95-105`) que se muestra condicionalmente si hay filtros activos, restableciendo todos los filtros. Además, el campo de título tiene un botón de "Clear" individual.
*   **Pregunta 4.d: ¿ofrezco siempre el número de resultados?**
    *   **Respuesta:** Sí, el número de resultados filtrados se muestra claramente en la página de listado de productos a través de un `Tag` en `ListProductsComponent.js` (`líneas 161-165`).
*   **Pregunta 4.e: ¿el número de cards de los productos mostrados en cada fila cambia en función del tamaño de la pantalla y siempre se respeta el espacio en blanco?**
    *   **Respuesta:** Sí, el diseño utiliza el sistema de grillas responsivas de Ant Design (`Row` y `Col` con `xs`, `sm`, `md`, `lg`, `xl` en `ListProductsComponent.js`, `línea 175`), ajustando el número de tarjetas por fila según el tamaño de la pantalla y manteniendo el espaciado con `gutter`.
*   **Pregunta 4.f: ¿Permito comprar directamente un producto desde el listado de productos?**
    *   **Respuesta:** Sí, cada `ProductCard` en el listado de productos puede mostrar un botón "Buy" (`showBuyButton={true}` en `ListProductsComponent.js`, `línea 179`). Al hacer clic, se inicia un proceso de compra con confirmación y registro de transacción.

### 3.5. Perfil de Usuario

*   **Pregunta 5.a: Muestra o da acceso a las transacciones que ha realizo un usuario ¿pero puedo ver rápidamente un resumen de esa información? Como el número de compras/ventas que ha realizo, o hace cuando tiempo ha realizado la última transacción.**
    *   **Respuesta:** Sí, el perfil de usuario (`wallapep/src/pages/components/profile/UserProfileComponent.js`) muestra un resumen rápido de "Total Sales", "Total Purchases", "Products for Sale" y "Total Transactions" a través de un `Card` de estadísticas (`líneas 257-275`). También proporciona acceso a una lista detallada de transacciones. No incluye explícitamente el "tiempo de la última transacción" en el resumen principal.

### 3.6. Información Relevante Antes de Realizar una Compra

*   **Pregunta 6.a: ¿Necesito mucha navegación para ver la “reputación” de un usuario?, entendiendo por reputación el número de transacciones que ha realizado ¿o puedo verlo desde la propia lista de productos o detalles?**
    *   **Respuesta:** La reputación del usuario no es visible directamente en el listado de productos. Sin embargo, está claramente accesible en la página de detalles de cada producto (`wallapep/src/pages/components/products/DetailsProductComponent.js`), donde el componente `ReputationTags` (`línea 175`) muestra el total de transacciones, ventas y compras del vendedor.

### 3.7. Referencias o Enlaces a Usuarios

*   **Pregunta 7.a: Cuando pongo una referencia a un usuario en alguna parte, por ejemplo, la descripción a un producto que incluye el nombre de su vendedor ¿Utilizo un avatar junto al nombre del usuario para que ayude a identificarlo?**
    *   **Respuesta:** Sí, en la página de detalles del producto (`DetailsProductComponent.js`, `líneas 168-172`), se muestra un `Avatar` con un icono `UserOutlined` junto al nombre del vendedor y un enlace a su perfil. En el perfil del usuario (`UserProfileComponent.js`, `líneas 203-207`), también se usa un avatar. Sin embargo, en la tabla de "Mis Transacciones" (`ListMyTransactionsComponent.js`), solo se muestra el nombre/email del usuario como enlace, sin avatar.

### 3.8. Validaciones de Entrada de Datos

*   **Pregunta 8.a: ¿admito valores negativos para precios?**
    *   **Respuesta:** No, el sistema no admite valores negativos para precios. Los formularios de creación y edición de productos (`CreateProductComponent.js`, `EditProductFormComponent.js`) y el `PriceEditor.js` (`líneas 25, 113` y `12` respectivamente) tienen reglas de validación que exigen precios mayores o iguales a 0.01.
*   **Pregunta 8.b: ¿fechas que no tengan sentido?, como un nacimiento posterior al día actual.**
    *   **Respuesta:** Sí, en la creación de cuentas de usuario (`CreateUserComponent.js`, `líneas 228-231`), el campo de fecha de nacimiento utiliza `disabledDate` para deshabilitar fechas futuras. En la edición de productos (`EditProductFormComponent.js`), no se observa una validación similar para evitar fechas futuras en la fecha del producto.

### 3.9. Imágenes e Iconos

*   **Pregunta 9.a: ¿Uso imágenes e icono para aumentar la velocidad de reconocimiento?, por ejemplo:**
    *   **i. En opciones de menú:** Es muy probable, dado el uso consistente en otras partes de la interfaz (no se revisó el componente de menú directamente).
    *   **ii. Delante de los títulos de cada página:** Sí, el `CardHeader.js` se utiliza para mostrar iconos relevantes junto a los títulos de las páginas/secciones (e.g., `ShoppingOutlined` para "Products" en `ListProductsComponent.js`, `UserAddOutlined` para "Create Your Account" en `CreateUserComponent.js`).
    *   **iii. Asociando un icono a cada categoría (quizá también hasta un color):** Sí, las categorías (`wallapep/src/pages/components/home/CategoriesSection.js`, `líneas 25-55` y `wallapep/src/utils/UtilsCategories.js`, `líneas 1-10`) tienen emojis asociados (que actúan como iconos) y las etiquetas de categoría usan colores.
    *   **iv. Asociando un icono a valores de tipos concretos junto al valor, fechas...:** Sí, en formularios (`CreateUserComponent.js`), detalles de usuario (`UserProfileComponent.js`) y estadísticas, se utilizan iconos como prefijos o sufijos para mejorar el reconocimiento visual del tipo de dato.

### 3.10. Sitio Web General

*   **Pregunta 10.a: ¿Siempre puedo identificar claramente en que parte de la página estoy?**
    *   **Respuesta:** Sí, a través de una barra de navegación con enlaces descriptivos e iconos, y títulos claros y contextuales en cada página o sección. No obstante, una implementación de Breadcrumbs podría mejorar aún más la claridad en rutas anidadas.
*   **Pregunta 10.b: ¿Puedo volver siempre a la página principal haciendo clic en el logo?**
    *   **Respuesta:** Sí, el logo en la barra de navegación (`wallapep/src/pages/_app.js`, `líneas 105, 113`) es un `Link` directo a la página principal (`"/"`).
*   **Pregunta 10.c: Uso un favicon y título en el sitio web.**
    *   **Respuesta:** Sí, se utiliza un favicon (`/logo.png` especificado en `wallapep/src/pages/_document.js`, `línea 7`) y el título del sitio web es "Wallapep - Buy and Sell Products" (`wallapep/src/pages/_app.js`, `línea 96`).

## 4. Tareas y Análisis KLM

### 4.1 – Listado de tareas de la aplicación.

**•	/** (Página de inicio)
    *   Ver los últimos productos agregados
    *   Buscar productos por categoría
    *   Buscar productos por nombre/descripción
    *   Ver productos destacados o promocionados
    *   Acceder a la página de login/registro
    *   Acceder a la página de mis productos/transacciones (si está logueado)

**•	/products**
    *   Buscar productos por categoría
    *   Buscar productos por precio (rango)
    *   Ordenar productos (por precio, fecha de publicación)
    *   Filtrar productos (por estado, ubicación)
    *   Comparar visualmente la información de los productos
    *   Ver los detalles de un producto

**•	/detailProduct/:id**
    *   Ver información detallada del producto (descripción, precio, imágenes)
    *   Ver información del vendedor
    *   Contactar al vendedor
    *   Realizar una oferta por el producto
    *   Añadir el producto a favoritos
    *   Reportar el producto

**•	/login**
    *   Iniciar sesión con credenciales existentes
    *   Recuperar contraseña
    *   Acceder a la página de registro

**•	/register**
    *   Crear una nueva cuenta de usuario
    *   Volver a la página de login

**•	/createProduct**
    *   Introducir detalles del nuevo producto (nombre, descripción, precio, categoría, imágenes)
    *   Publicar el producto
    *   Cancelar la creación del producto

**•	/myProducts**
    *   Ver la lista de productos propios publicados
    *   Editar un producto existente
    *   Eliminar un producto
    *   Marcar un producto como vendido/reservado
    *   Ver el estado de las ofertas recibidas en mis productos

**•	/editProduct/:id**
    *   Modificar la información de un producto propio
    *   Actualizar las imágenes del producto
    *   Guardar los cambios del producto
    *   Cancelar la edición

**•	/profile**
    *   Ver el perfil del usuario (propio)
    *   Editar información del perfil (nombre, email, contraseña)
    *   Ver estadísticas del usuario (productos vendidos, compras realizadas, valoraciones)
    *   Ver la reputación del usuario
    *   Acceder a "Mis productos"
    *   Acceder a "Mis transacciones"

**•	/user/:id**
    *   Ver el perfil de otro usuario
    *   Ver los productos publicados por otro usuario
    *   Ver la reputación de otro usuario
    *   Contactar a otro usuario

**•	/myTransactions**
    *   Ver la lista de transacciones realizadas (compras y ventas)
    *   Ver el estado de cada transacción
    *   Acceder a los detalles de una transacción

**•	/detailTransaction/:id**
    *   Ver información detallada de una transacción específica (productos, precio, estado, comprador/vendedor)
    *   Comunicarse con la otra parte de la transacción
    *   Valorar al comprador/vendedor (si la transacción ha finalizado)

---

### 4.2 – KLM

Se han seleccionado dos tareas para el análisis KLM:

1.  Buscar productos de una categoría en la página `/products` y ver un detalle de un producto.
2.  Iniciar sesión en `/login`.

---

### **Informe de la Tarea 1: Buscar productos de una categoría y ver el detalle de un producto**

**1. Descripción de la Tarea**
La tarea consiste en que un usuario, desde la página principal de productos (`/products`), navegue a través de una categoría específica y, posteriormente, acceda a la vista de detalles de un producto seleccionado dentro de esa categoría.

**2. Datos de Ejemplo Utilizados**
*   **Categoría Seleccionada:** "Electrónica"
*   **Producto Seleccionado:** "Smartphone"

**3. Desglose de Operaciones KLM (Keystroke-Level Model)**

| Operación | Descripción                                             | Tiempo Estimado (segundos) | Notas                                                     |
| :-------- | :------------------------------------------------------ | :------------------------- | :-------------------------------------------------------- |
| P         | Mover el ratón al menú desplegable de categorías.       | 1.1                        | Apuntar al elemento de la interfaz.                       |
| K         | Hacer clic para abrir el menú de categorías.            | 0.28                       | Pulsación de botón del ratón.                             |
| P         | Mover el ratón a la opción "Electrónica" en el menú.    | 1.1                        | Apuntar al elemento de la interfaz.                       |
| K         | Hacer clic en la categoría "Electrónica".               | 0.28                       | Pulsación de botón del ratón.                             |
| P         | Mover el ratón al producto "Smartphone" en la lista.    | 1.1                        | Apuntar al elemento de la interfaz.                       |
| K         | Hacer clic en el producto "Smartphone".                 | 0.28                       | Pulsación de botón del ratón.                             |
| M         | Procesar visualmente la información detallada del producto. | 1.2                        | Tiempo mental para entender y asimilar la nueva información. |

**4. Cálculos del Tiempo Total**
*   **Tiempo de Pulsaciones (K):** 3 operaciones * 0.28 s/op = 0.84 segundos
*   **Tiempo de Apuntar (P):** 3 operaciones * 1.1 s/op = 3.3 segundos
*   **Tiempo Mental (M):** 1 operación * 1.2 s/op = 1.2 segundos

**Tiempo Total Estimado para la Tarea 1:** 0.84 s + 3.3 s + 1.2 s = **5.34 segundos**

**5. Observaciones**
Este análisis asume que el usuario ya conoce la ubicación de los elementos de la interfaz (menú de categorías, producto) y que no hay demoras significativas en la carga de la página. El factor "M" (Mental) es una estimación del tiempo necesario para que el usuario procese el cambio de vista y la nueva información presentada.

---

### **Informe de la Tarea 2: Iniciar Sesión en la Aplicación**

**1. Descripción de la Tarea**
La tarea implica que un usuario, desde la página de inicio de sesión (`/login`), ingrese sus credenciales (email y contraseña) en los campos correspondientes y confirme la acción mediante el botón de iniciar sesión.

**2. Datos de Ejemplo Utilizados**
*   **Email del Usuario:** `usuario@example.com`
*   **Contraseña del Usuario:** `password123`

**3. Desglose de Operaciones KLM (Keystroke-Level Model)**

| Operación | Descripción                                            | Número de K | Tiempo Estimado (segundos) | Notas                                                                    |
| :-------- | :----------------------------------------------------- | :---------- | :------------------------- | :----------------------------------------------------------------------- |
| P         | Mover el ratón al campo de entrada de email.           |             | 1.1                        | Apuntar al campo.                                                        |
| K         | Hacer clic para enfocar el campo de email.             | 1           | 0.28                       | Pulsación de botón del ratón.                                            |
| K         | Escribir "usuario@example.com".                        | 19          | 19 * 0.28 = 5.32           | Cada carácter se cuenta como una pulsación.                              |
| P         | Mover el ratón al campo de entrada de contraseña.      |             | 1.1                        | Apuntar al campo.                                                        |
| K         | Hacer clic para enfocar el campo de contraseña.        | 1           | 0.28                       | Pulsación de botón del ratón.                                            |
| K         | Escribir "password123".                                | 11          | 11 * 0.28 = 3.08           | Cada carácter se cuenta como una pulsación.                              |
| P         | Mover el ratón al botón "Iniciar Sesión".              |             | 1.1                        | Apuntar al botón.                                                        |
| K         | Hacer clic en el botón "Iniciar Sesión".               | 1           | 0.28                       | Pulsación de botón del ratón.                                            |
| M         | Procesar el resultado de la operación de inicio de sesión. |             | 1.2                        | Tiempo mental para verificar el éxito o fracaso del inicio de sesión. |

**4. Cálculos del Tiempo Total**
*   **Tiempo de Pulsaciones (K):** (1 + 19 + 1 + 11 + 1) operaciones * 0.28 s/op = 33 operaciones * 0.28 s/op = 9.24 segundos
*   **Tiempo de Apuntar (P):** 3 operaciones * 1.1 s/op = 3.3 segundos
*   **Tiempo Mental (M):** 1 operación * 1.2 s/op = 1.2 segundos

**Tiempo Total Estimado para la Tarea 2:** 9.24 s + 3.3 s + 1.2 s = **13.74 segundos**

**5. Observaciones**
Este análisis asume que el usuario tiene una velocidad de escritura promedio. No considera posibles errores de tecleo o la necesidad de corregirlos, ni el tiempo de carga de la página después de enviar el formulario. El factor "M" es una estimación del tiempo de procesamiento mental del resultado del login.

**Nota sobre KLM:** Los tiempos asignados a K (pulsación de tecla), P (apuntar con el ratón), H (cambio de manos de teclado a ratón), M (operación mental) son valores promedio estándar. En un entorno real, estos tiempos pueden variar significativamente según el usuario, la interfaz y el hardware.

## 5. Conclusiones y Recomendaciones

### 5.1. Fortalezas

*   **Interfaz Intuitiva y Guiada:** El uso consistente de iconos, títulos descriptivos y elementos visuales claros facilita la navegación y el reconocimiento rápido de la información en toda la aplicación.
*   **Funcionalidades Clave Bien Implementadas:** La búsqueda y filtrado de productos, la edición rápida de precios en la tabla de productos, y la visibilidad de la reputación del vendedor en los detalles del producto son características que mejoran significativamente la experiencia del usuario.
*   **Diseño Responsivo:** Las tablas y las tarjetas de productos se adaptan correctamente a diferentes tamaños de pantalla, lo que garantiza una buena usabilidad en dispositivos móviles y de escritorio.
*   **Validaciones Robustas:** Las validaciones de campos como el precio (valores positivos) y la fecha de nacimiento (no fechas futuras) demuestran un enfoque en la calidad de los datos y la prevención de errores del usuario.

### 5.2. Áreas de Mejora

*   **Truncamiento de Texto en Tarjetas de Producto:** Considerar la implementación de `text-overflow: ellipsis;` o `max-height` con `overflow: hidden;` para títulos y descripciones largas en las tarjetas de productos, a fin de mantener un layout más uniforme y evitar que el contenido desborde los contenedores.
*   **Resumen de Transacciones Más Detallado:** Aunque se proporcionan resúmenes generales de transacciones, añadir métricas temporales (ej. "productos comprados/vendidos en el último mes", "última transacción hace X tiempo") podría enriquecer la información disponible para el usuario.
*   **Avatares en Tablas de Transacciones:** Incluir avatares junto a los nombres de usuario en las tablas de transacciones podría mejorar la identificación visual y la coherencia con otras secciones de la aplicación.
*   **Validación de Fecha de Productos:** Evaluar si es necesario aplicar una validación de fecha similar a la del cumpleaños del usuario para los productos (evitando fechas futuras) en el formulario de edición, según el contexto de cuándo se espera que se "publiquen" los productos.
*   **Implementación de Breadcrumbs:** Para mejorar aún más la claridad de la ubicación del usuario, especialmente en rutas anidadas, se recomienda implementar el componente `Breadcrumb` de Ant Design.
*   **Navegación del menú con estado activo**: Aunque el menú funciona, no hay un resaltado explícito del elemento de menú que corresponde a la página actual. Esto se podría mejorar para que el usuario siempre sepa qué parte del menú corresponde a la página en la que se encuentra.