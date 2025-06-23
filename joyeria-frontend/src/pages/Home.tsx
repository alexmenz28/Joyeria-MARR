import React from 'react';

const Home = () => {
  return (
    <div className="min-h-full font-sans">
      {/* HERO VISUAL */}
      <section className="relative h-[70vh] flex items-center justify-center bg-gradient-to-br from-yellow-100 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        <img src="/Logo-MARR.png" alt="Joya principal" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-marrGold drop-shadow mb-4 tracking-wide">El arte de brillar</h1>
          <p className="text-xl md:text-2xl text-gray-800 dark:text-gray-200 mb-8">Joyas exclusivas, hechas para ti</p>
          <a href="/catalogo" className="inline-block bg-marrGold text-white px-8 py-3 rounded-full shadow-lg hover:bg-yellow-600 transition text-lg font-semibold">Ver colección</a>
        </div>
      </section>

      {/* COLECCIONES DESTACADAS */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center text-marrGold mb-10">Colecciones destacadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden group hover:scale-105 transition">
            <img src="/Logo-MARR.png" alt="Colección Aurora" className="w-full h-56 object-cover group-hover:opacity-80 transition" />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-marrGold mb-2">Aurora</h3>
              <p className="text-gray-700 dark:text-gray-200 mb-4">Piezas inspiradas en la luz y el renacer. Oro y diamantes en perfecta armonía.</p>
              <a href="/catalogo" className="text-marrGold underline font-medium">Descubrir</a>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden group hover:scale-105 transition">
            <img src="/Logo-MARR.png" alt="Colección Eternum" className="w-full h-56 object-cover group-hover:opacity-80 transition" />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-marrGold mb-2">Eternum</h3>
              <p className="text-gray-700 dark:text-gray-200 mb-4">Joyas atemporales para momentos inolvidables. El lujo que trasciende generaciones.</p>
              <a href="/catalogo" className="text-marrGold underline font-medium">Descubrir</a>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden group hover:scale-105 transition">
            <img src="/Logo-MARR.png" alt="Colección Esencia" className="w-full h-56 object-cover group-hover:opacity-80 transition" />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-marrGold mb-2">Esencia</h3>
              <p className="text-gray-700 dark:text-gray-200 mb-4">Minimalismo y elegancia en cada detalle. Para quienes buscan sutileza y distinción.</p>
              <a href="/catalogo" className="text-marrGold underline font-medium">Descubrir</a>
            </div>
          </div>
        </div>
      </section>

      {/* NUESTRA HISTORIA */}
      <section className="bg-gradient-to-r from-yellow-50 via-white to-yellow-100 py-16 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <img src="/Logo-MARR.png" alt="Taller Joyeria" className="w-64 h-64 object-contain rounded-full shadow-lg border-4 border-marrGold" />
          <div>
            <h2 className="text-3xl font-bold text-marrGold mb-4">Nuestra historia</h2>
            <p className="text-gray-800 dark:text-gray-700 text-lg mb-2">Desde hace más de dos décadas, Joyeria MARR transforma emociones en piezas únicas. Nuestra pasión por el arte y la excelencia nos impulsa a crear joyas que cuentan historias y celebran momentos irrepetibles.</p>
            <p className="text-gray-800 dark:text-gray-700 text-lg">Cada joya es elaborada por manos expertas, fusionando tradición y vanguardia, con un compromiso inquebrantable por la calidad y la sostenibilidad.</p>
          </div>
        </div>
      </section>

      {/* PERSONALIZA TU JOYA */}
      <section className="max-w-6xl mx-auto py-16 px-4 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-marrGold mb-4">Personaliza tu joya</h2>
          <p className="text-gray-700 dark:text-gray-200 text-lg mb-6">Haz realidad la joya de tus sueños. Nuestro equipo te acompaña en cada paso para crear una pieza exclusiva, diseñada solo para ti.</p>
          <a href="/CustomOrder" className="inline-block bg-marrGold text-white px-8 py-3 rounded-full shadow-lg hover:bg-yellow-600 transition text-lg font-semibold">Comienza tu diseño</a>
        </div>
        <img src="/Logo-MARR.png" alt="Personalización" className="w-80 h-80 object-contain rounded-xl shadow-lg border-2 border-marrGold" />
      </section>

      {/* TESTIMONIOS */}
      <section className="bg-white dark:bg-gray-900 py-16 px-4">
        <h2 className="text-3xl font-bold text-center text-marrGold mb-10">Lo que dicen nuestras clientas</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-yellow-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <p className="text-lg text-gray-800 dark:text-gray-200 italic mb-4">“La atención fue impecable y la joya superó todas mis expectativas. ¡Volveré sin dudarlo!”</p>
            <div className="flex items-center gap-4">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Ana G." className="w-12 h-12 rounded-full border-2 border-marrGold" />
              <span className="text-marrGold font-semibold">Ana G.</span>
            </div>
          </div>
          <div className="bg-yellow-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <p className="text-lg text-gray-800 dark:text-gray-200 italic mb-4">“Me ayudaron a personalizar un anillo para mi aniversario. El resultado fue espectacular y el proceso, muy sencillo.”</p>
            <div className="flex items-center gap-4">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Luis M." className="w-12 h-12 rounded-full border-2 border-marrGold" />
              <span className="text-marrGold font-semibold">Luis M.</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROMOCIÓN / NOVEDAD */}
      <section className="relative bg-gradient-to-r from-marrGold/80 to-yellow-200 py-12 px-4 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">¡Nueva colección Primavera 2025!</h2>
          <p className="text-white text-lg mb-4">Descubre piezas inspiradas en la naturaleza y la luz. Solo por tiempo limitado: <span className="font-bold">10% de descuento</span> en tu primera compra.</p>
          <a href="/catalogo" className="inline-block bg-white text-marrGold px-8 py-3 rounded-full shadow-lg hover:bg-yellow-100 transition text-lg font-semibold">Ver novedades</a>
        </div>
        <img src="/Logo-MARR.png" alt="Nueva colección" className="w-56 h-56 object-contain rounded-xl shadow-lg border-2 border-white" />
      </section>

      {/* INSTAGRAM / COMUNIDAD */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center text-marrGold mb-10">#JoyeriaMARR en Instagram</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80" alt="Cliente 1" className="w-full h-48 object-cover rounded-lg shadow-md hover:scale-105 transition" />
          <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80" alt="Cliente 2" className="w-full h-48 object-cover rounded-lg shadow-md hover:scale-105 transition" />
          <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" alt="Cliente 3" className="w-full h-48 object-cover rounded-lg shadow-md hover:scale-105 transition" />
          <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80" alt="Cliente 4" className="w-full h-48 object-cover rounded-lg shadow-md hover:scale-105 transition" />
        </div>
        <div className="text-center mt-8">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-marrGold underline font-medium text-lg">Síguenos en Instagram</a>
        </div>
      </section>
    </div>
  );
};

export default Home; 