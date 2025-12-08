import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">TuOrdenYa</h1>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <LanguageSwitcher />
              <Link href="/pricing" className="text-gray-700 hover:text-orange-600 font-medium">
                Precios
              </Link>
              <Link href="/backoffice/login" className="text-gray-700 hover:text-orange-600 font-medium">
                Iniciar Sesión
              </Link>
              <Link 
                href="/admin" 
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
              >
                Comenzar Gratis
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            La Plataforma de Gestión de Restaurantes
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-700">
              Más Fácil de América Latina
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Digitaliza tu restaurante en minutos. Menús digitales, gestión de pedidos, 
            y análisis todo en un solo lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/admin"
              className="px-8 py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-lg font-semibold"
            >
              Comenzar Gratis →
            </Link>
            <Link 
              href="/pricing"
              className="px-8 py-4 bg-white text-orange-600 border-2 border-orange-600 rounded-lg hover:bg-orange-50 transition text-lg font-semibold"
            >
              Ver Planes
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            ✓ Sin tarjeta de crédito requerida  ✓ Gratis para siempre con el plan Light
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white rounded-3xl shadow-xl my-12">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Todo lo que Necesitas para Tu Restaurante
          </h3>
          <p className="text-xl text-gray-600">
            Desde menús digitales hasta gestión completa de pedidos
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl">
            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-2xl">📱</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Menú Digital con QR</h4>
            <p className="text-gray-600">
              Tus clientes escanean el código QR y ven tu menú actualizado al instante. 
              Multi-idioma incluido.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-2xl">🍽️</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Gestión de Pedidos</h4>
            <p className="text-gray-600">
              Recibe y gestiona pedidos en tiempo real. Notificaciones instantáneas 
              para tu cocina y meseros.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-2xl">📊</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Análisis y Reportes</h4>
            <p className="text-gray-600">
              Dashboards en tiempo real con ventas, productos más vendidos, 
              y métricas de rendimiento.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl">
            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-2xl">🪑</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Gestión de Mesas</h4>
            <p className="text-gray-600">
              Control completo de tus mesas y ubicaciones. Asigna pedidos y 
              rastrea ocupación. (Plan Pro)
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-2xl">🎨</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Variantes de Productos</h4>
            <p className="text-gray-600">
              Tamaños, extras, personalizaciones. Gestiona todas las opciones 
              de tus productos. (Plan Pro)
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 bg-gradient-to-br from-cyan-50 to-sky-50 rounded-2xl">
            <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-2xl">🌎</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Multi-idioma</h4>
            <p className="text-gray-600">
              Español e inglés incluidos. Tus clientes eligen su idioma 
              preferido automáticamente.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Planes para Cada Etapa de Tu Negocio
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Light */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-200">
            <h4 className="text-2xl font-bold text-gray-900 mb-2">Light</h4>
            <p className="text-4xl font-bold text-gray-900 mb-4">
              Gratis
            </p>
            <p className="text-gray-600 mb-6">Para siempre</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span className="text-gray-700">Menú digital ilimitado</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span className="text-gray-700">Códigos QR por ubicación</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span className="text-gray-700">Multi-idioma</span>
              </li>
            </ul>
            <Link 
              href="/admin"
              className="block w-full text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-semibold"
            >
              Comenzar Gratis
            </Link>
          </div>

          {/* Plus */}
          <div className="bg-orange-600 p-8 rounded-2xl shadow-xl border-2 border-orange-700 transform scale-105">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-2xl font-bold text-white">Plus</h4>
              <span className="px-3 py-1 bg-white text-orange-600 text-xs font-bold rounded-full">
                Popular
              </span>
            </div>
            <p className="text-4xl font-bold text-white mb-4">
              $29<span className="text-xl">/mes</span>
            </p>
            <p className="text-orange-100 mb-6">Facturación mensual</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-white mt-1">✓</span>
                <span className="text-white">Todo de Light, más:</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white mt-1">✓</span>
                <span className="text-white">Gestión de pedidos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white mt-1">✓</span>
                <span className="text-white">Reportes básicos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white mt-1">✓</span>
                <span className="text-white">Soporte prioritario</span>
              </li>
            </ul>
            <Link 
              href="/pricing"
              className="block w-full text-center px-6 py-3 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition font-semibold"
            >
              Elegir Plus
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-200">
            <h4 className="text-2xl font-bold text-gray-900 mb-2">Pro</h4>
            <p className="text-4xl font-bold text-gray-900 mb-4">
              $79<span className="text-xl">/mes</span>
            </p>
            <p className="text-gray-600 mb-6">Facturación mensual</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span className="text-gray-700">Todo de Plus, más:</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span className="text-gray-700">Gestión de mesas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span className="text-gray-700">Variantes de productos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span className="text-gray-700">Reportes avanzados</span>
              </li>
            </ul>
            <Link 
              href="/pricing"
              className="block w-full text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-semibold"
            >
              Elegir Pro
            </Link>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/pricing"
            className="text-orange-600 hover:text-orange-700 font-semibold"
          >
            Ver comparación completa de planes →
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h3 className="text-3xl font-bold mb-4">
            ¿Listo para Transformar Tu Restaurante?
          </h3>
          <p className="text-xl mb-8 text-orange-100">
            Únete a cientos de restaurantes que ya digitalizaron su operación
          </p>
          <Link 
            href="/admin"
            className="inline-block px-8 py-4 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition text-lg font-semibold"
          >
            Comenzar Gratis Ahora
          </Link>
        </div>
      </section>
    </div>
  );
}
