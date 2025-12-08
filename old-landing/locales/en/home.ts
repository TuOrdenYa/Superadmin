// locales/en/home.ts
import type { HomeContent } from "../types";

export const homeEn: HomeContent = {
  site: { title: "TuOrdenYa – Digital menus and operations for restaurants" },
  pages: {
    light: {
      ctaLabel: "I want the Light plan",
      detailCtaLabel: "Talk about the Light product",
      badge: "Light Plan — Your digital menu in days, not months",
      title: "Digital menu + QR",
      highlight: "to move beyond paper.",
      subtitle: "Light is for restaurants, coffee shops and food trucks that want a modern digital menu with a QR per location and WhatsApp ordering, without complex systems.",
      bullets: [
        "Responsive digital menu (mobile, tablet, desktop).",
        "QR code per location, ready to print.",
        "‘Order via WhatsApp’ button with prefilled message.",
        "Basic branding to match your restaurant.",
      ],
      segments: [
        "☕ Coffee shops and bakeries",
        "🌮 Food trucks and street stands",
        "🍽️ Small restaurants without a POS",
      ],
      summary: {
        label: "Plan summary",
        planName: "TuOrdenYa Light",
        chip: "Starting point",
        stats: [
          { label: "Solution type", value: "Digital menu + QR" },
          { label: "Main channel", value: "WhatsApp" },
          { label: "Typical launch time", value: "Few days" },
        ],
        includesTitle: "Includes",
        includesList: [
          "Base menu configuration.",
          "QR generation per location.",
          "Menu design in your basic style.",
          "Hosting and technical domain included.",
        ],
        footer: "When volume grows and you need to log orders or see reports you can upgrade to Plus or Pro without changing platform.",
      },
      details: {
        title: "What the Light plan includes",
        subtitle: "Everything needed so your menu no longer depends on paper and you can update prices and dishes without re-printing.",
        features: [
          { title: "Mobile-ready digital menu", text: "We load your categories, products and descriptions so guests see a clear modern menu." },
          { title: "QR per location", text: "A QR for each venue to place on tables, packaging or flyers. Price changes keep working." },
          { title: "WhatsApp ordering", text: "Prefilled message button so customers write faster and you get clarity over the order." },
          { title: "Basic brand alignment", text: "We apply your colors and logo for consistency without custom builds." },
        ],
      },
      upgrade: {
        title: "Start with Light and scale when needed",
        subtitle: "Light gets you off paper fast. When you need more control over orders and data you already have the path to Plus and Pro.",
        bullets: [
          "If you want to log each order and see sales by day/hour your next step is Plus.",
          "If you manage many tables, kitchen, bar and bills the path is Pro.",
          "In all cases your digital menu and QR remain the same.",
        ],
      },
      suitability: {
        title: "Is Light for you?",
        bullets: [
          "You don't yet record orders in a system.",
          "You change prices with some frequency.",
          "Your customers already use WhatsApp to ask or order.",
          "You want something simple, fast and affordable.",
        ],
      },
    },
    plus: {
      ctaLabel: "I want the Plus plan",
      detailCtaLabel: "Talk about the Plus product",
      badge: "Plus Plan — When you want to see orders and data",
      title: "Basic orders + reports",
      highlight: "to better understand your operation.",
      subtitle: "Plus is the natural step after Light: you keep your menu and QR but now start logging orders and seeing simple reports to decide with data.",
      bullets: [
        "Basic order logging by day and channel.",
        "Simple reports: sales, top products.",
        "Keep the same digital menu and QR from Light.",
        "No complexity of tables or advanced kitchen flows.",
      ],
      segments: [
        "🍽️ Restaurants with more rotation",
        "🍕 Brands with frequent deliveries",
        "🥡 Businesses already feeling higher volume",
      ],
      summary: {
        label: "Plan summary",
        planName: "TuOrdenYa Plus",
        chip: "Orders + data",
        stats: [
          { label: "Solution type", value: "Menu + basic orders" },
          { label: "Primary focus", value: "Logging and reports" },
          { label: "Complexity level", value: "Medium / manageable" },
        ],
        includesTitle: "Includes",
        includesList: [
          "Everything in Light.",
          "Basic order logging.",
          "Sales reports by date range.",
          "Top products and average ticket.",
        ],
        footer: "When you need tables, kitchen timing and split bills Pro is the next natural step.",
      },
      details: {
        title: "What the Plus plan includes",
        subtitle: "Plus mixes your digital menu with simple order logging and reports to understand sales.",
        features: [
          { title: "Centralized order logging", text: "Track orders from dining room, WhatsApp or delivery without a complex table system." },
          { title: "Basic reports", text: "Sales by day, time slot and channel to understand peaks and slow moments." },
          { title: "Top products", text: "See best sellers and slow movers to adjust menu, combos or promos." },
          { title: "Ready base for Pro", text: "Structure prepared to migrate without starting over." },
        ],
      },
      upgrade: {
        title: "When to jump to Pro?",
        subtitle: "If Plus feels limited because you handle many tables, prep times or areas, Pro becomes the right tool.",
        bullets: [
          "You manage multiple tables simultaneously and need status visibility.",
          "You want to split bills, manage tips and control closing.",
          "You want to see prep times and avoid bottlenecks.",
        ],
      },
      suitability: {
        title: "Is Plus for you?",
        bullets: [
          "You already have good order volume.",
          "You want clear data without complexity.",
          "Not yet ready for full dining room operations.",
          "You need more insight than a menu alone gives.",
        ],
      },
    },
    pro: {
      ctaLabel: "I want to talk about Pro",
      detailCtaLabel: "Schedule a conversation about Pro",
      badge: "RestOrder Pro — Full operations for serious restaurants",
      title: "Tables, kitchen, bills and timing",
      highlight: "in a single system built for your dining room.",
      subtitle: "Pro is for restaurants that manage tables, multiple areas, kitchen and bar, and need fine control over orders, timing and daily closing.",
      bullets: [
        "Orders by table, channel and status.",
        "Send to kitchen and bar with preparation states.",
        "Bills, splits, tips and prep for checkout.",
        "Operational reports for the shift.",
      ],
      segments: [
        "🏬 Chains and brands with multiple locations",
        "🍽️ Dining restaurants with high rotation",
        "🍱 Dark kitchens with high volume",
      ],
      summary: {
        label: "Plan summary",
        planName: "RestOrder Pro",
        chip: "Full operations",
        stats: [
          { label: "Solution type", value: "Tables + kitchen + bills" },
          { label: "Primary focus", value: "Dining room operations" },
          { label: "Complexity level", value: "High, controlled" },
        ],
        includesTitle: "Includes",
        includesList: [
          "Everything in Light and Plus.",
          "Orders by table and channel.",
          "Kitchen and bar flow + tracking.",
          "Bill handling, splits and tips.",
          "Operational reports by slot and channel.",
        ],
        footer: "Pro is built on the same TuOrdenYa base: your menu and QR remain while you expand operations.",
      },
      details: {
        title: "How Pro helps day to day",
        subtitle: "Built for real operations: waiters, kitchen, bar, bills and multiple entry channels.",
        features: [
          { title: "Table & status control", text: "See free, occupied or ready-to-pay tables without paper." },
          { title: "Kitchen & bar flow", text: "Send orders and handle states ‘preparing’, ‘ready’, ‘served’." },
          { title: "Bills & payments", text: "Split bills, manage tips and prepare everything for POS/cash drawer." },
          { title: "Operational reports", text: "Rotation, demand by slot and channels with higher ticket." },
        ],
      },
      upgrade: {
        title: "Designed for demanding operations",
        subtitle: "Ideal for structured repetitive operations with roles and constant rotation.",
        bullets: [
          "High-rotation restaurants with many tables.",
          "Bars and gastrobars with separated kitchen & bar.",
          "Small/medium chains with multiple locations.",
          "Dark kitchens orchestrating multiple channels.",
        ],
      },
      suitability: {
        title: "Is Pro for you now?",
        bullets: [
          "Paper leaves things out already.",
          "You manage shifts, waiters and zones.",
          "You want to standardize beyond individuals.",
          "You need clarity on timing and performance.",
        ],
      },
    },
  },
  navbar: {
    subtitle: "Menus and orders for restaurants",
    backToHome: "Back to home",
    howItWorks: "How it works",
    products: "Our products",
    faq: "FAQs",
    demo: "Schedule a demo",
    light: "Light — Menu + QR",
    plus: "Plus — Orders and reports",
    pro: "Pro — Full operations",
  },

  hero: {
    badge: "Start with Light, grow into Plus and Pro",
    title: "Digital menus and full operations",
    highlight: "for restaurants of any size.",
    description:
      "TuOrdenYa has three levels for every stage of your business: Light (menu + QR), Plus (orders and basic reports) and Pro (full dining room and kitchen operations). Start where you are and upgrade when you need it.",
    planCtaLabel: {
      Light: "I want my digital menu (Light)",
      Plus: "I want to talk about Plus",
      Pro: "I want to talk about Pro",
    },
    secondaryCta: "See Light / Plus / Pro products",
    segments: [
      "☕ Coffee shops, food trucks and small venues (Light)",
      "🍽️ Dine-in restaurants with more volume (Plus)",
      "🏬 Chains and dark kitchens (Pro)",
    ],
    summary: {
      suiteLabel: "TuOrdenYa Suite",
      title: "Choose the level for your restaurant",
      chip: "Scalable by stages",
      lightTitle: "Light",
      lightChip: "Starting point",
      lightText: "Responsive digital menu, QR per location and WhatsApp ordering. Ideal for coffee shops, food trucks and small venues.",
      plusTitle: "Plus",
      plusChip: "Orders + reports",
      plusText: "Everything in Light plus basic order tracking and simple reports so you know what sells and when.",
      proTitle: "Pro",
      proChip: "Full operations",
      proText: "Orders by table and channel, kitchen times, checks and closing. Designed for high-rotation restaurants and chains.",
      footer: "You start with the level you need today and can move to Plus or Pro without changing platform or menu.",
    },
  },

  benefitsSection: {
    title: "What you get with TuOrdenYa",
    subtitle:
      "You move from a printed menu to a digital experience that connects orders, operations and data in one place.",
    columns: [
      {
        items: [
          "• Guests see your menu by scanning a QR code.",
          "• You receive orders via WhatsApp or directly from the system.",
          "• Update prices and dishes without printing new menus.",
        ],
      },
      {
        items: [
          "• Basic reports in Plus and full operations in Pro.",
          "• Scalable: start with Light and upgrade to Plus/Pro as you grow.",
          "• Ready to integrate with your current flow (POS, kitchen, etc.).",
        ],
      },
    ],
  },

  integrationsSection: {
    title: "Integrations and ecosystem",
    subtitle:
      "TuOrdenYa is designed to connect with other tools you already use in your restaurant. We start simple and grow with you.",
    cards: [
      {
        title: "Order channels",
        description:
          "QR, WhatsApp and dining room orders. Designed to add more channels in the future.",
      },
      {
        title: "Payments and billing",
        description:
          "Future integration with payment gateways and/or POS systems. The architecture is already prepared for that.",
      },
      {
        title: "Data and reports",
        description:
          "Database ready to feed dashboards and advanced reports (Plus and Pro).",
      },
    ],
  },

  productsSection: {
    title: "Products designed for you",
    subtitle:
      "Start with the basics and scale as your restaurant grows. All products include hosting, technical domain and basic support.",
    recommendedLabel: "Recommended",
    products: [
      {
        id: "light",
        variant: "light",
        label: "Light",
        title: "Menu + QR + WhatsApp",
        description:
          "Perfect for coffee shops, food trucks and small businesses that want to move away from paper menus.",
        bullets: [
          "Responsive digital menu.",
          "QR code per location.",
          "“Order via WhatsApp” button.",
          "Basic branding to match your style.",
        ],
        bottomNote: "👉 Fast and affordable starting point.",
      },
      {
        id: "plus",
        variant: "plus",
        label: "Plus",
        title: "Basic orders + reports",
        description:
          "For restaurants with higher volume that need simple sales insights.",
        bullets: [
          "Everything in Light.",
          "Basic order tracking.",
          "Simple sales reports.",
          "Better visibility over operations.",
        ],
        bottomNote: "👉 Ideal once you move past “menu only”.",
      },
      {
        id: "pro",
        variant: "pro",
        label: "Pro",
        title: "Full operations",
        description:
          "Built for day-to-day operations: tables, kitchen, bills, timing and reports.",
        bullets: [
          "Everything in Light and Plus.",
          "Orders by table and channel.",
          "Kitchen and bar workflow.",
          "Bills, tips and closing.",
          "Key operational reports.",
        ],
        recommended: true,
        ctaLabel: "Get a Pro quote",
        ctaHref: "#contacto",
      },
    ],
  },

  contactSection: {
    title: "Let’s talk about your restaurant",
    subtitle:
      "Leave your details and we’ll show you how TuOrdenYa can help you sell more and operate better.",
    bullets: [
      "• Short call to understand your operation.",
      "• Demo adapted to your type of business.",
      "• Clear recommendation: Light, Plus or Pro.",
    ],
    form: {
      nameLabel: "Full name",
      namePlaceholder: "e.g. John Doe",
      restaurantLabel: "Restaurant name",
      restaurantPlaceholder: "e.g. La Parrilla 24",
      whatsappLabel: "WhatsApp",
      whatsappPlaceholder: "e.g. +57 300 000 0000",
      emailLabel: "Email",
      emailPlaceholder: "e.g. name@tuordenya.com",
      interestLabel: "What are you interested in?",
      interestPlaceholder: "Select an option",
      interestOptions: [
        { value: "light", label: "Digital menu only (Light)" },
        {
          value: "plus",
          label: "Menu + orders and reports (Plus)",
        },
        {
          value: "pro",
          label: "Full operation (Pro)",
        },
        {
          value: "unsure",
          label: "Not sure, I’d like advice",
        },
      ],
      notesLabel: "Tell us a bit about your operation",
      notesPlaceholder: "Number of tables, locations, if you use a POS, etc.",
      submitLabel: "Send message",
      submitLabelLoading: "Sending...",
      privacyNotice:
        "We respect your time: no spam, only relevant information for your restaurant.",
      whatsappIntro: "👋 Hello — a lead arrived via the TuOrdenYa landing page.",
      sourceLabel: "Source: tuordenya.com",
    },
  },

  faqSection: {
    title: "Frequently asked questions",
    subtitle:
      "If you have specific questions about your operation, tell us and we’ll adapt the implementation to your case.",
    items: [
      {
        question: "How long does implementation take?",
        answer:
          "It depends on the complexity of your menu and operations, but we usually talk about days, not months. Light can be ready very quickly; Pro requires a bit more coordination.",
      },
      {
        question: "Do I need to replace my current POS?",
        answer:
          "Not necessarily. TuOrdenYa can live alongside your current POS while we define the level of integration that makes sense for your business.",
      },
      {
        question: "Can I start with Light and upgrade later?",
        answer:
          "Yes. The whole idea is that you start with the basics and upgrade to Plus or Pro when your restaurant’s volume justifies it.",
      },
    ],
  },

  howItWorksSection: {
    title: "How TuOrdenYa works",
    subtitle:
      "Three levels designed for different stages of your restaurant. Start simple and scale when you need it.",
    steps: [
      {
        label: "1",
        title: "Light — Menu + QR + WhatsApp",
        description:
          "We digitize your menu, generate a QR per location and connect orders via WhatsApp. Perfect for coffee shops and smaller venues.",
      },
      {
        label: "2",
        title: "Plus — Basic orders + reports",
        description:
          "When volume grows, you activate order tracking and simple reports to understand what sells, at what times, and how your operation is doing.",
      },
      {
        label: "3",
        title: "Pro — Full operations",
        description:
          "For restaurants with dining rooms, kitchen and higher rotation. Manage orders by table and channel, prep times, bills, tips and daily closing.",
      },
    ],
  },

  proDetailsSection: {
    title: "Pro in detail: full front-of-house and kitchen operations",
    subtitle:
      "When your restaurant handles more tables, more locations or more channels, Pro helps you keep daily operations under control.",
    cards: [
      {
        title: "Tables, dining room and channels",
        badge: "Front-of-house",
        description:
          "Organize your tables, dining areas and service types (dine-in, delivery, takeout) in one place.",
        bullets: [
          "Assign orders by table or ticket number.",
          "Overview of table occupation and rotation.",
          "Support for multiple sales channels in parallel.",
        ],
      },
      {
        title: "Kitchen and bar connected",
        badge: "Production",
        description:
          "What the waiter records is sent to kitchen and bar with the right information and in the right order.",
        bullets: [
          "Tickets split by area (kitchen, bar, desserts).",
          "Clearer preparation times for the team.",
          "Fewer back-and-forth trips between dining room and kitchen.",
        ],
      },
      {
        title: "Bills, closing and reports",
        badge: "Control",
        description:
          "More organized closing at the end of the shift and better visibility of the day-to-day.",
        bullets: [
          "Bills per table, split checks and tips.",
          "Closing by shift, cash drawer or responsible person.",
          "Basic operational reports ready to review.",
        ],
      },
    ],
    note: "Pro is designed to grow with you: we start with basic operations and can later enable more advanced integrations (POS, payments, etc.).",
    ctaLabel: "I want to talk about the Pro plan",
  },

  testimonialsSection: {
    title: "What restaurants like yours say",
    subtitle:
      "We start with real cases and adjust the tool based on the type of operation.",
    items: [
      {
        quote:
          "With Light we stopped printing menus every time we changed a dish. Now we update everything in minutes.",
        name: "Laura Gómez",
        role: "Owner — Neighborhood coffee shop",
      },
      {
        quote:
          "Plus helped us understand which products sold more at specific times. We make better inventory decisions.",
        name: "Carlos Pérez",
        role: "Manager — Casual restaurant",
      },
      {
        quote:
          "With Pro we organized front-of-house and kitchen operations. Order mistakes dropped and daily closing is clearer.",
        name: "María Rodríguez",
        role: "Manager — High-rotation restaurant",
      },
    ],
  },

  footer: {
    copyright: "All rights reserved.",
    products: "Products",
    faq: "FAQs",
    contact: "Contact",
  },
};
