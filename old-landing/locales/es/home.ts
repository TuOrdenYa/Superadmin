// locales/es/home.ts
import type { HomeContent } from "../types";

export const homeEs: HomeContent = {
  site: { title: "TuOrdenYa – Menús digitales y gestión para restaurantes" },
  pages: {
    light: {
      ctaLabel: "Quiero el plan Light",
      detailCtaLabel: "Hablar del producto Light",
      badge: "Plan Light — Tu menú digital en días, no meses",
      title: "Menú digital + QR",
      highlight: "para salir del papel.",
      subtitle: "Light es el plan para restaurantes, cafeterías y food trucks que quieren tener un menú digital moderno, con QR por local y pedidos por WhatsApp, sin complicarse con sistemas complejos.",
      bullets: [
        "Menú digital responsive (móvil, tablet y computador).",
        "Código QR por local, listo para imprimir.",
        "Botón ‘Ordenar por WhatsApp’ con mensaje prellenado.",
        "Ajuste básico a la marca de tu restaurante.",
      ],
      segments: [
        "☕ Cafeterías y panaderías",
        "🌮 Food trucks y puestos de comida",
        "🍽️ Restaurantes pequeños sin POS",
      ],
      summary: {
        label: "Resumen plan",
        planName: "TuOrdenYa Light",
        chip: "Punto de partida",
        stats: [
          { label: "Tipo de solución", value: "Menú digital + QR" },
          { label: "Canal principal", value: "WhatsApp" },
          { label: "Tiempo típico de salida", value: "Pocos días" },
        ],
        includesTitle: "Incluye",
        includesList: [
          "Configuración de carta base.",
          "Generación de QR por local.",
          "Diseño del menú en tu línea básica.",
          "Hosting y dominio técnico incluidos.",
        ],
        footer: "Cuando tu volumen crezca y necesites registrar pedidos o ver reportes, puedes migrar a Plus o Pro sin cambiar de plataforma.",
      },
      details: {
        title: "Lo que incluye el plan Light",
        subtitle: "Todo lo necesario para que tu menú deje de depender del papel y puedas actualizar precios y platos sin volver a imprimir.",
        features: [
          {
            title: "Menú digital listo para móvil",
            text: "Cargamos tus categorías, productos y descripciones para que tus clientes vean la carta desde su celular, con una experiencia clara y moderna.",
          },
          {
            title: "QR por local",
            text: "Te entregamos un código QR por sede para usar en mesas, empaques o flyers. Si cambias precios, el QR sigue funcionando.",
          },
          {
            title: "Pedidos por WhatsApp",
            text: "Botón con mensaje prellenado para que los clientes escriban más fácil y tú tengas claridad sobre el pedido.",
          },
          {
            title: "Ajuste básico a tu marca",
            text: "Usamos tus colores y logo para que el menú se vea alineado con la identidad de tu restaurante.",
          },
        ],
      },
      upgrade: {
        title: "Empieza con Light y escala cuando lo necesites",
        subtitle: "Light es perfecto para salir rápido del papel. Cuando necesitas más control de pedidos y datos, el camino a Plus y Pro ya está listo.",
        bullets: [
          "Si quieres registrar cada pedido y ver ventas por día/horario, el siguiente paso es Plus.",
          "Si manejas muchas mesas, cocina, barra y cuentas, el camino es Pro.",
          "En todos los casos, tu menú digital y tu QR siguen siendo los mismos.",
        ],
      },
      suitability: {
        title: "¿Es Light para ti?",
        bullets: [
          "Aún no registras pedidos en un sistema.",
          "Cambias precios con cierta frecuencia.",
          "Tus clientes ya usan WhatsApp para escribir o preguntar.",
          "Quieres algo simple, rápido y económico.",
        ],
      },
    },
    plus: {
      ctaLabel: "Quiero el plan Plus",
      detailCtaLabel: "Hablar del producto Plus",
      badge: "Plan Plus — Cuando ya quieres ver pedidos y datos",
      title: "Pedidos básicos + reportes",
      highlight: "para entender mejor tu operación.",
      subtitle: "Plus es el paso natural después de Light: mantienes tu menú y tus QR, pero ahora registras pedidos y ves reportes simples para decidir con datos.",
      bullets: [
        "Registro básico de pedidos por día y canal.",
        "Reportes sencillos: ventas, productos más vendidos.",
        "Mantienes el mismo menú y QR de Light.",
        "Sin complejidad de mesas ni cocina avanzada.",
      ],
      segments: [
        "🍽️ Restaurantes con más rotación",
        "🍕 Marcas con domicilios frecuentes",
        "🥡 Negocios que ya sienten más volumen",
      ],
      summary: {
        label: "Resumen plan",
        planName: "TuOrdenYa Plus",
        chip: "Pedidos + datos",
        stats: [
          { label: "Tipo de solución", value: "Menú + pedidos básicos" },
          { label: "Foco principal", value: "Registro y reportes" },
          { label: "Nivel de complejidad", value: "Medio / manejable" },
        ],
        includesTitle: "Incluye",
        includesList: [
          "Todo lo del plan Light.",
          "Registro de pedidos básicos.",
          "Reportes de ventas por fechas.",
          "Productos más vendidos y ticket promedio.",
        ],
        footer: "Cuando necesites manejar mesas, tiempos de cocina y cuentas separadas, Pro es el siguiente paso natural.",
      },
      details: {
        title: "Lo que incluye el plan Plus",
        subtitle: "Plus combina tu menú digital con registro simple de pedidos y reportes para entender tus ventas.",
        features: [
          { title: "Registro centralizado de pedidos", text: "Control de pedidos por salón, WhatsApp o domicilio sin sistema complejo de mesas." },
          { title: "Reportes básicos", text: "Ventas por día, franja y canal para entender picos y momentos lentos." },
          { title: "Top de productos", text: "Identifica platos más vendidos y ajusta menú, combos o promociones." },
          { title: "Base lista para Pro", text: "Estructura preparada para migrar sin empezar de cero." },
        ],
      },
      upgrade: {
        title: "¿Cuándo subir a Pro?",
        subtitle: "Si Plus te queda corto porque manejas muchas mesas, tiempos o ambientes, Pro se vuelve la herramienta adecuada.",
        bullets: [
          "Manejas varias mesas simultáneas y necesitas ver estados.",
          "Te interesa dividir cuentas, propinas y controlar cierres.",
          "Quieres ver tiempos de preparación y evitar cuellos de botella.",
        ],
      },
      suitability: {
        title: "¿Es Plus para ti?",
        bullets: [
          "Ya tienes buen volumen de pedidos.",
          "Quieres datos claros sin complicarte.",
          "Aún no estás listo para operación de salón completa.",
          "Necesitas más información que solo un menú.",
        ],
      },
    },
    pro: {
      ctaLabel: "Quiero hablar de la versión Pro",
      detailCtaLabel: "Agendar una conversación sobre Pro",
      badge: "RestOrder Pro — Operación completa para restaurantes en serio",
      title: "Mesas, cocina, cuentas y tiempos",
      highlight: "en un solo sistema pensado para tu salón.",
      subtitle: "Pro es para restaurantes que manejan mesas, ambientes, cocina y barra, y necesitan control fino sobre órdenes, tiempos y cierres.",
      bullets: [
        "Órdenes por mesa, canal y estado.",
        "Envío a cocina y barra con estados.",
        "Cuentas, división, propinas y preparación para caja.",
        "Reportes operativos de la jornada.",
      ],
      segments: [
        "🏬 Cadenas y marcas con varias sedes",
        "🍽️ Restaurantes con salón y alta rotación",
        "🍱 Dark kitchens con alto volumen",
      ],
      summary: {
        label: "Resumen plan",
        planName: "RestOrder Pro",
        chip: "Operación completa",
        stats: [
          { label: "Tipo de solución", value: "Mesas + cocina + cuentas" },
          { label: "Foco principal", value: "Operación en salón" },
          { label: "Nivel de complejidad", value: "Alto, controlado" },
        ],
        includesTitle: "Incluye",
        includesList: [
          "Todo lo de Light y Plus.",
          "Órdenes por mesa y canal.",
          "Flujo y seguimiento en cocina y barra.",
          "Manejo de cuentas, división y propinas.",
          "Reportes operativos por franja y canal.",
        ],
        footer: "Pro se construye sobre la misma base de TuOrdenYa: tu menú y tus QR se mantienen mientras amplías operación.",
      },
      details: {
        title: "Cómo te ayuda Pro en el día a día",
        subtitle: "Pensado para la operación real: meseros, cocina, barra, cuentas y canales de entrada.",
        features: [
          { title: "Control de mesas y estados", text: "Visualiza mesas libres, ocupadas o listas para pagar sin papeles." },
          { title: "Flujo de cocina y barra", text: "Envía órdenes y maneja estados ‘en preparación’, ‘listo’ o ‘entregado’." },
          { title: "Cuentas y pagos", text: "Divide cuentas, maneja propinas y deja todo listo para caja/POS." },
          { title: "Reportes operativos", text: "Ve rotación de mesas, demanda por franja y canales con mayor ticket." },
        ],
      },
      upgrade: {
        title: "Diseñado para operaciones exigentes",
        subtitle: "Ideal para operaciones repetitivas y estructuradas con roles y rotación constante.",
        bullets: [
          "Restaurantes de alta rotación con muchas mesas.",
          "Bares y gastrobares con cocina y barra separadas.",
          "Cadenas pequeñas y medianas con varias sedes.",
          "Dark kitchens que orquestan varios canales.",
        ],
      },
      suitability: {
        title: "¿Es Pro para ti ahora?",
        bullets: [
          "Ya se te quedan cosas por fuera en papel.",
          "Manejas turnos, meseros y zonas.",
            "Quieres estandarizar sin depender de cada persona.",
          "Necesitas claridad de tiempos y desempeño del salón.",
        ],
      },
    },
  },
  navbar: {
    subtitle: "Menús y órdenes para restaurantes",
    backToHome: "Volver al inicio",
    howItWorks: "Cómo funciona",
    products: "Nuestros productos",
    faq: "FAQs",
    demo: "Agenda una demo",
    light: "Light — Menú + QR",
    plus: "Plus — Pedidos y reportes",
    pro: "Pro — Operación completa",
  },

  hero: {
    badge: "Empieza con Light, escala a Plus y Pro cuando crezcas",
    title: "Menús digitales y operación completa",
    highlight: "para restaurantes de cualquier tamaño.",
    description:
      "TuOrdenYa tiene tres niveles pensados para cada etapa de tu negocio: Light (menú + QR), Plus (pedidos y reportes básicos) y Pro (operación completa en salón y cocina). Empiezas donde estás y escalas cuando lo necesites.",
    planCtaLabel: {
      Light: "Quiero mi menú digital (Light)",
      Plus: "Quiero hablar de Plus",
      Pro: "Quiero hablar de Pro",
    },
    secondaryCta: "Ver productos Light / Plus / Pro",
    segments: [
      "☕ Cafeterías, food trucks y locales pequeños (Light)",
      "🍽️ Restaurantes con salón y mayor volumen (Plus)",
      "🏬 Cadenas y dark kitchens (Pro)",
    ],
    summary: {
      suiteLabel: "Suite TuOrdenYa",
      title: "Elige el nivel para tu restaurante",
      chip: "Escalable por etapas",
      lightTitle: "Light",
      lightChip: "Punto de partida",
      lightText: "Menú digital responsive, QR por local y botón de pedido por WhatsApp. Ideal para cafeterías, food trucks y negocios pequeños.",
      plusTitle: "Plus",
      plusChip: "Pedidos + reportes",
      plusText: "Todo lo de Light, más registro de pedidos básicos y reportes sencillos para entender qué se vende y cuándo.",
      proTitle: "Pro",
      proChip: "Operación completa",
      proText: "Órdenes por mesa y canal, tiempos de cocina, cuentas y cierres. Pensado para restaurantes de alta rotación, cadenas y dark kitchens.",
      footer: "Empiezas con el nivel que necesitas hoy y puedes migrar a Plus o Pro sin cambiar de plataforma ni de menú.",
    },
  },

  benefitsSection: {
    title: "¿Qué ganas con TuOrdenYa?",
    subtitle:
      "Pasas de un menú impreso a una experiencia digital que conecta pedidos, operación y datos en un solo lugar.",
    columns: [
      {
        items: [
          "• Los clientes ven tu carta escaneando un código QR.",
          "• Recibes pedidos por WhatsApp o directamente desde el sistema.",
          "• Actualizas precios y platos sin reimprimir menús.",
        ],
      },
      {
        items: [
          "• Reportes básicos desde Plus y operación completa en Pro.",
          "• Escalable: comienza con Light y migra a Plus/Pro cuando creces.",
          "• Base lista para integrarse con tu flujo actual (POS, cocina, etc.).",
        ],
      },
    ],
  },

  integrationsSection: {
    title: "Integraciones y ecosistema",
    subtitle:
      "TuOrdenYa está diseñado para conversar con otras herramientas que ya usas en tu restaurante. Empezamos simple y vamos creciendo contigo.",
    cards: [
      {
        title: "Canales de pedido",
        description:
          "QR, WhatsApp y órdenes desde salón. Diseñado para sumar otros canales en el futuro.",
      },
      {
        title: "Pagos y facturación",
        description:
          "Integración futura con pasarelas y/o POS. La arquitectura ya está pensada para eso.",
      },
      {
        title: "Datos y reportes",
        description:
          "Base de datos preparada para alimentar tableros e informes avanzados (Plus y Pro).",
      },
    ],
  },

  productsSection: {
    title: "Productos pensados para ti",
    subtitle:
      "Comienza con lo básico y escala a medida que tu restaurante crece. Todos los productos incluyen hosting, dominio técnico y soporte básico.",
    recommendedLabel: "Recomendado",
    products: [
      {
        id: "light",
        variant: "light",
        label: "Light",
        title: "Menú + QR + WhatsApp",
        description:
          "Ideal para cafeterías, food trucks y negocios pequeños que quieren salir del papel.",
        bullets: [
          "Menú digital responsive.",
          "Código QR por local.",
          "Botón “Ordenar por WhatsApp”.",
          "Ajuste básico a tu marca.",
        ],
        bottomNote: "👉 Punto de partida rápido y económico.",
      },
      {
        id: "plus",
        variant: "plus",
        label: "Plus",
        title: "Pedidos básicos + reportes",
        description:
          "Para restaurantes que empiezan a manejar más volumen y necesitan ver datos simples.",
        bullets: [
          "Todo lo de Light.",
          "Registro de pedidos básicos.",
          "Reportes de ventas sencillos.",
          "Mejor visibilidad de operación.",
        ],
        bottomNote: "👉 Ideal cuando ya superaste la fase “solo menú”.",
      },
      {
        id: "pro",
        variant: "pro",
        label: "Pro",
        title: "Operación completa",
        description:
          "Pensado para la operación diaria: mesas, cocina, cuentas, tiempos y reportes.",
        bullets: [
          "Todo lo de Light y Plus.",
          "Órdenes por mesa y canal.",
          "Flujo de cocina y barra.",
          "Cuentas, propinas y cierres.",
          "Reportes operativos clave.",
        ],
        recommended: true,
        ctaLabel: "Quiero cotizar Pro",
        ctaHref: "#contacto",
      },
    ],
  },

  contactSection: {
    title: "Conversemos sobre tu restaurante",
    subtitle:
      "Déjanos tus datos y te contactamos para mostrarte cómo TuOrdenYa puede ayudarte a vender más y operar mejor.",
    bullets: [
      "• Hacemos una llamada corta para entender tu operación.",
      "• Te mostramos un demo adaptado a tu tipo de negocio.",
      "• Te proponemos un plan claro (Light, Plus o Pro).",
    ],
    form: {
      nameLabel: "Nombre completo",
      namePlaceholder: "Ej: Juan Pérez",
      restaurantLabel: "Nombre del restaurante",
      restaurantPlaceholder: "Ej: La Parrilla 24",
      whatsappLabel: "WhatsApp",
      whatsappPlaceholder: "Ej: +57 300 000 0000",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "Ej: nombre@tuordenya.com",
      interestLabel: "¿Qué te interesa?",
      interestPlaceholder: "Selecciona una opción",
      interestOptions: [
        { value: "light", label: "Solo menú digital (Light)" },
        { value: "plus", label: "Menú + pedidos y reportes (Plus)" },
        { value: "pro", label: "Operación completa (Pro)" },
        {
          value: "unsure",
          label: "No estoy seguro, quiero que me asesoren",
        },
      ],
      notesLabel: "Cuéntanos un poco de tu operación",
      notesPlaceholder: "Número de mesas, sedes, si usas POS, etc.",
      submitLabel: "Enviar mensaje",
      submitLabelLoading: "Enviando...",
      privacyNotice:
        "Respetamos tu tiempo: nada de spam, solo información relevante para tu restaurante.",
      whatsappIntro: "👋 Hola, llegó un lead desde la landing de TuOrdenYa.",
      sourceLabel: "Fuente: tuordenya.com",
    },
  },

  faqSection: {
    title: "Preguntas frecuentes",
    subtitle:
      "Si tienes dudas específicas de tu operación, cuéntanos y adaptamos la implementación a tu caso.",
    items: [
      {
        question: "¿Cuánto se demora la implementación?",
        answer:
          "Depende de la complejidad de tu carta y operación, pero normalmente tomamos días, no meses. Light puede quedar listo muy rápido; Pro requiere un poco más de coordinación.",
      },
      {
        question: "¿Necesito cambiar mi POS actual?",
        answer:
          "No necesariamente. TuOrdenYa puede convivir con tu POS actual mientras definimos el nivel de integración que tenga sentido para tu negocio.",
      },
      {
        question: "¿Puedo empezar con Light y luego subir?",
        answer:
          "Sí. Justamente la idea es que empieces con lo básico y puedas migrar a Plus o Pro cuando el volumen de tu restaurante lo justifique.",
      },
    ],
  },

  howItWorksSection: {
    title: "Cómo funciona TuOrdenYa",
    subtitle:
      "Tres niveles pensados para diferentes etapas de tu restaurante. Empieza simple y escala cuando lo necesites.",
    steps: [
      {
        label: "1",
        title: "Light — Menú + QR + WhatsApp",
        description:
          "Digitalizamos tu carta, generamos el QR por local y conectamos los pedidos por WhatsApp. Ideal para cafeterías y negocios pequeños.",
      },
      {
        label: "2",
        title: "Plus — Pedidos básicos + reportes",
        description:
          "Cuando el volumen crece, activas el registro de pedidos y reportes sencillos para entender qué se vende, en qué horarios y cómo va tu operación.",
      },
      {
        label: "3",
        title: "Pro — Operación completa",
        description:
          "Para restaurantes con salón, cocina y más movimiento. Manejo de órdenes por mesa y canal, tiempos de preparación, cuentas, propinas y cierres diarios.",
      },
    ],
  },

  proDetailsSection: {
    title: "Pro en detalle: operación completa en salón y cocina",
    subtitle:
      "Cuando tu restaurante ya maneja más mesas, más sedes o más canales, Pro te ayuda a ordenar la operación diaria sin perder el control.",
    cards: [
      {
        title: "Mesas, salones y canales",
        badge: "Piso de salón",
        description:
          "Organiza tus mesas, salones y tipos de servicio (salón, domicilio, para llevar) desde un mismo lugar.",
        bullets: [
          "Asignación de órdenes por mesa o número de pedido.",
          "Visual de ocupación y rotación de mesas.",
          "Soporte para varios canales de venta en paralelo.",
        ],
      },
      {
        title: "Cocina y barra conectadas",
        badge: "Producción",
        description:
          "Lo que el mesero registra llega a cocina y barra con la información correcta y en el orden adecuado.",
        bullets: [
          "Tickets separados por área (cocina, barra, postres).",
          "Tiempos de preparación más claros para el equipo.",
          "Menos idas y vueltas entre salón y cocina.",
        ],
      },
      {
        title: "Cuentas, cierres y reportes",
        badge: "Control",
        description:
          "Cierres más ordenados al final del turno y mejor visibilidad del día a día.",
        bullets: [
          "Cuentas por mesa, división y propinas.",
          "Cierres por turno, caja o responsable.",
          "Reportes operativos básicos listos para revisar.",
        ],
      },
    ],
    note: "Pro está pensado para crecer contigo: empezamos por la operación básica y luego se pueden activar integraciones más avanzadas (POS, pagos, etc.).",
    ctaLabel: "Quiero hablar de la versión Pro",
  },

  testimonialsSection: {
    title: "Lo que dicen restaurantes como el tuyo",
    subtitle:
      "Empezamos con casos reales y vamos ajustando la herramienta según el tipo de operación.",
    items: [
      {
        quote:
          "Con Light dejamos de imprimir menús cada vez que cambiábamos un plato. Ahora actualizamos todo en minutos.",
        name: "Laura Gómez",
        role: "Dueña — Cafetería de barrio",
      },
      {
        quote:
          "Plus nos ayudó a entender qué productos se movían más por horarios. Tomamos mejores decisiones de inventario.",
        name: "Carlos Pérez",
        role: "Administrador — Restaurante casual",
      },
      {
        quote:
          "Con Pro ordenamos la operación entre salón y cocina. Se redujeron los errores en pedidos y el cierre del día es más claro.",
        name: "María Rodríguez",
        role: "Gerente — Restaurante de alta rotación",
      },
    ],
  },

  footer: {
    copyright: "Todos los derechos reservados.",
    products: "Productos",
    faq: "FAQs",
    contact: "Contacto",
  },
};
