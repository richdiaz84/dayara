
    import React from 'react';
    import { User, ShoppingBag, Settings, BarChart2, Users as UsersIcon, Gift, MessageSquare, FileText, Truck, Shield, HelpCircle, CreditCard, Percent, Star, Video, Eye, Search as SearchIcon, Filter as FilterIcon, ShoppingCart as CartIcon, Heart, GitCompareArrows, LogIn, LogOut, UserPlus as UserPlusIcon, Edit, Trash2, PlusCircle, Image as ImageIcon, ExternalLink, CalendarDays, CheckCircle, XCircle, Package, DollarSign, RefreshCw, Menu as MenuIcon, Palette, Sun, Moon, ShoppingCart } from 'lucide-react';

    export const manualData = [
      {
        title: "Guía para Clientes",
        icon: <User className="h-6 w-6 mr-3 text-primary" />,
        content: [
          {
            subtitle: "1. Navegación y Búsqueda de Productos",
            icon: <SearchIcon className="h-5 w-5 mr-2 text-blue-500" />,
            steps: [
              "Utiliza el menú principal (Inicio, Productos) para explorar categorías.",
              "En la página de 'Productos', usa la barra de búsqueda para encontrar artículos por nombre o descripción.",
              "Aplica filtros (categoría, precio, etc.) para refinar tu búsqueda.",
              "Ordena los productos por popularidad, precio o fecha.",
            ],
            imageSuggestion: "Captura de la página de productos con la barra de búsqueda y filtros resaltados."
          },
          {
            subtitle: "2. Ver Detalles de un Producto",
            icon: <Eye className="h-5 w-5 mr-2 text-green-500" />,
            steps: [
              "Haz clic en un producto para ver su página de detalle.",
              "Visualiza la galería de imágenes y videos del producto.",
              "Lee la descripción completa, especificaciones y revisa el precio.",
              "Consulta las reseñas de otros clientes.",
              "Añade el producto al carrito o a tu lista de deseos.",
            ],
            imageSuggestion: "Captura de la página de detalle de un producto, mostrando la galería, descripción y botones de acción."
          },
          {
            subtitle: "3. Gestionar el Carrito de Compras",
            icon: <CartIcon className="h-5 w-5 mr-2 text-orange-500" />,
            steps: [
              "Accede a tu carrito desde el ícono en la esquina superior derecha.",
              "Modifica las cantidades de los productos o elimínalos.",
              "Visualiza el subtotal y procede al pago.",
            ],
            imageSuggestion: "Captura de la página del carrito de compras."
          },
          {
            subtitle: "4. Proceso de Checkout (Finalizar Compra)",
            icon: <CreditCard className="h-5 w-5 mr-2 text-purple-500" />,
            steps: [
              "Si no has iniciado sesión, se te pedirá hacerlo o continuar como invitado.",
              "Ingresa tu información de contacto y dirección de envío.",
              "Selecciona tu método de envío.",
              "Ingresa los detalles de tu dirección de facturación (si es diferente).",
              "Revisa el resumen de tu pedido (productos, costos, total).",
              "Selecciona tu método de pago (ej. PayPal o Simulado).",
              "Sigue las instrucciones para completar el pago.",
              "Recibirás una confirmación de pedido.",
            ],
            imageSuggestion: "Secuencia de capturas del proceso de checkout: formulario de dirección, selección de pago, resumen del pedido, confirmación."
          },
          {
            subtitle: "5. Cuenta de Usuario",
            icon: <User className="h-5 w-5 mr-2 text-teal-500" />,
            steps: [
              "Regístrate o inicia sesión para acceder a tu cuenta.",
              "En 'Mi Perfil', actualiza tu información personal.",
              "En 'Mis Pedidos', revisa el historial y estado de tus compras.",
              "En 'Programa de Lealtad', consulta tus puntos y nivel actual.",
              "Accede a 'Contenido Exclusivo' para ver videos de productos comprados.",
            ],
            imageSuggestion: "Capturas del dashboard de la cuenta de usuario, mostrando las secciones de perfil, pedidos y lealtad."
          },
          {
            subtitle: "6. Lista de Deseos y Comparación",
            icon: <Heart className="h-5 w-5 mr-2 text-red-500" />,
            steps: [
              "Añade productos a tu 'Lista de Deseos' desde la página de producto o listados.",
              "Visualiza tu lista de deseos desde el ícono correspondiente.",
              "Selecciona productos para 'Comparar' y visualiza sus características lado a lado.",
            ],
            imageSuggestion: "Capturas de la página de lista de deseos y de la página de comparación de productos."
          },
          {
            subtitle: "7. Solicitar Cotizaciones",
            icon: <FileText className="h-5 w-5 mr-2 text-indigo-500" />,
            steps: [
              "Navega a 'Solicitar Cotización'.",
              "Busca y añade productos a tu solicitud.",
              "Ingresa tus datos de contacto y cualquier nota adicional.",
              "Envía la solicitud. Un agente se pondrá en contacto contigo.",
            ],
            imageSuggestion: "Captura de la página de solicitud de cotización."
          }
        ]
      },
      {
        title: "Guía para Administradores y Agentes",
        icon: <Settings className="h-6 w-6 mr-3 text-primary" />,
        content: [
          {
            subtitle: "A1. Acceso al Panel de Administración",
            icon: <LogIn className="h-5 w-5 mr-2 text-gray-500" />,
            steps: [
              "Inicia sesión con tus credenciales de administrador o agente.",
              "Accede al panel a través del enlace 'Admin' en el menú de usuario (si está visible para tu rol) o navegando directamente a '/admin'.",
            ],
            imageSuggestion: "Captura de la pantalla de inicio de sesión y del dashboard del panel de administración."
          },
          {
            subtitle: "A2. Dashboard Principal",
            icon: <BarChart2 className="h-5 w-5 mr-2 text-blue-500" />,
            steps: [
              "Visualiza estadísticas clave: ventas, nuevos clientes, productos activos, pedidos pendientes.",
              "Revisa la actividad reciente y alertas importantes.",
            ],
            imageSuggestion: "Captura del dashboard principal del admin."
          },
          {
            subtitle: "A3. Gestión de Productos",
            icon: <Package className="h-5 w-5 mr-2 text-green-500" />,
            steps: [
              "Navega a 'Productos' en el menú lateral del admin.",
              "Para añadir un producto: Haz clic en 'Añadir Producto', completa el formulario (nombre, descripción, precio, stock, categoría, código de barras), sube imágenes y añade videos (marcando si son gratuitos o de pago).",
              "Para editar: Busca el producto, haz clic en 'Editar'. Modifica los campos necesarios.",
              "Para eliminar: Busca el producto, haz clic en 'Eliminar' y confirma.",
              "Publica o despublica productos usando el switch de estado.",
            ],
            imageSuggestion: "Secuencia de capturas: listado de productos, formulario de creación/edición de producto con campos resaltados."
          },
          {
            subtitle: "A4. Gestión de Usuarios (Admin)",
            icon: <UsersIcon className="h-5 w-5 mr-2 text-purple-500" />,
            steps: [
              "Navega a 'Usuarios'.",
              "Visualiza la lista de usuarios registrados.",
              "Añade nuevos usuarios manualmente (admin, agente, cliente).",
              "Edita la información y rol de los usuarios.",
              "Activa/desactiva o elimina usuarios.",
            ],
            imageSuggestion: "Captura de la tabla de gestión de usuarios y del formulario de edición."
          },
          {
            subtitle: "A5. Gestión de Pedidos (Admin)",
            icon: <ShoppingCart className="h-5 w-5 mr-2 text-orange-500" />,
            steps: [
              "Navega a 'Pedidos'.",
              "Visualiza todos los pedidos, filtra o busca por cliente/ID.",
              "Haz clic en 'Ver' para detalles completos del pedido.",
              "Haz clic en 'Editar' para actualizar el estado del pedido (ej. 'Procesando', 'Enviado') y el estado del pago.",
              "Las actualizaciones de estado pueden (conceptualmente) disparar sincronizaciones con sistemas de envío y contabilidad.",
            ],
            imageSuggestion: "Captura de la lista de pedidos y del modal de edición de estado de un pedido."
          },
          {
            subtitle: "A6. Gestión de Banners Publicitarios (Admin)",
            icon: <ImageIcon className="h-5 w-5 mr-2 text-red-500" />,
            steps: [
              "Navega a 'Banners'.",
              "Añade nuevos banners: título, descripción, imagen, URL de enlace, fechas de activación/desactivación.",
              "Edita o elimina banners existentes.",
              "Los banners activos se mostrarán en la página de inicio.",
            ],
            imageSuggestion: "Captura de la gestión de banners y del formulario de creación/edición."
          },
          {
            subtitle: "A7. Gestión de Cotizaciones (Admin)",
            icon: <FileText className="h-5 w-5 mr-2 text-indigo-500" />,
            steps: [
              "Navega a 'Cotizaciones'.",
              "Visualiza las solicitudes de cotización de los clientes.",
              "Edita una cotización para: cambiar su estado (pendiente, aprobada, rechazada), asignar un agente de ventas, y establecer una fecha de validez.",
              "Utiliza el botón de 'Enviar por WhatsApp' (simulado) para generar un mensaje pre-llenado.",
            ],
            imageSuggestion: "Captura de la lista de cotizaciones y del modal de edición de una cotización."
          },
          {
            subtitle: "A8. Gestión de Reseñas (Admin)",
            icon: <MessageSquare className="h-5 w-5 mr-2 text-yellow-500" />,
            steps: [
              "Navega a 'Reseñas'.",
              "Filtra reseñas por estado (todas, pendientes, aprobadas).",
              "Aprueba reseñas pendientes para que sean visibles en la página del producto.",
              "Desaprueba o elimina reseñas según sea necesario.",
            ],
            imageSuggestion: "Captura de la página de gestión de reseñas con filtros y acciones."
          },
          {
            subtitle: "A9. Programa de Lealtad (Admin)",
            icon: <Gift className="h-5 w-5 mr-2 text-pink-500" />,
            steps: [
              "Navega a 'Lealtad'.",
              "Define y gestiona los niveles de lealtad: nombre del nivel, puntos mínimos requeridos, porcentaje de descuento y beneficios asociados.",
              "Los puntos se otorgan automáticamente a los clientes al completar compras.",
            ],
            imageSuggestion: "Captura de la página de gestión de niveles de lealtad."
          },
          {
            subtitle: "A10. Reportes (Admin)",
            icon: <BarChart2 className="h-5 w-5 mr-2 text-cyan-500" />,
            steps: [
              "Navega a 'Reportes'.",
              "Selecciona el tipo de reporte: Ventas, Inventario o Clientes.",
              "Para reportes de ventas y clientes, selecciona un rango de fechas.",
              "Genera reportes como: Resumen de Ventas, Ventas por Producto, Actividad de Clientes, Estado Actual del Stock, Productos con Bajo Stock.",
              "Visualiza los datos directamente en la página.",
            ],
            imageSuggestion: "Captura de la página de reportes, mostrando la selección de fechas y un ejemplo de reporte generado."
          },
          {
            subtitle: "A11. Punto de Venta - TPV (Agentes/Admin)",
            icon: <ShoppingCart className="h-5 w-5 mr-2 text-lime-500" />,
            steps: [
              "Accede a 'TPV' (disponible para roles de agente y admin).",
              "Busca productos por nombre o escaneando (simulado) su código de barras.",
              "Añade productos al carrito del TPV, ajusta cantidades.",
              "Ingresa la información del cliente (nombre, email, teléfono, si acepta marketing).",
              "Finaliza la venta. El pedido se registrará asociado al agente y se actualizará el stock.",
            ],
            imageSuggestion: "Captura de la interfaz del TPV, mostrando la búsqueda de productos y el carrito."
          }
        ]
      },
      {
        title: "Configuraciones Generales",
        icon: <Palette className="h-6 w-6 mr-3 text-primary" />,
        content: [
          {
            subtitle: "C1. Cambiar Tema (Modo Oscuro/Claro)",
            icon: <Sun className="h-5 w-5 mr-2 text-yellow-500" />,
            steps: [
              "En la cabecera, busca el ícono de sol/luna.",
              "Haz clic para alternar entre el modo claro y el modo oscuro.",
              "Tu preferencia se guardará para futuras visitas.",
            ],
            imageSuggestion: "Captura de la cabecera mostrando el botón de cambio de tema."
          }
        ]
      }
    ];
  