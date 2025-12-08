export default function StructuredData() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TuOrdenYa",
    "url": "https://tuordenya.com",
    "logo": "https://tuordenya.com/logo-tuordenya-white.png",
    "description": "Sistema de menús digitales con QR, pedidos por WhatsApp y operación completa para restaurantes",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Sales",
      "availableLanguage": ["Spanish", "English"]
    },
    "sameAs": [
      // Add your social media profiles here when available
      // "https://www.facebook.com/tuordenya",
      // "https://www.instagram.com/tuordenya",
      // "https://www.linkedin.com/company/tuordenya"
    ]
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TuOrdenYa",
    "url": "https://tuordenya.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://tuordenya.com/#contacto?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "TuOrdenYa",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": [
      {
        "@type": "Offer",
        "name": "Light",
        "description": "Menú digital + QR para restaurantes pequeños",
        "category": "Entry Level"
      },
      {
        "@type": "Offer",
        "name": "Plus",
        "description": "Pedidos básicos + reportes para restaurantes en crecimiento",
        "category": "Mid Level"
      },
      {
        "@type": "Offer",
        "name": "Pro",
        "description": "Operación completa con mesas, cocina y cuentas",
        "category": "Professional"
      }
    ],
    "featureList": [
      "Menú digital responsive",
      "Código QR por local",
      "Pedidos por WhatsApp",
      "Registro de pedidos",
      "Reportes de ventas",
      "Control de mesas",
      "Gestión de cocina y barra",
      "División de cuentas"
    ],
    "audience": {
      "@type": "Audience",
      "audienceType": "Restaurants, Cafes, Food Trucks"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplication) }}
      />
    </>
  );
}
