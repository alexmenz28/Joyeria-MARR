import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-full font-sans">
      {/* HERO CONTACTO */}
      <section className="relative h-64 md:h-80 flex items-center justify-center bg-gradient-to-br from-yellow-100 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden mb-10">
        <img src="/Logo-MARR.png" alt="Contacto joyería" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <div className="relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-marrGold drop-shadow mb-2 tracking-wide">Contacto</h2>
          <p className="text-lg md:text-xl text-gray-800 dark:text-gray-200">¿Tienes dudas? ¡Estamos para ayudarte!</p>
        </div>
      </section>

      {/* FORMULARIO Y DATOS */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-4 py-10">
        {/* Formulario */}
        <form className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-marrGold flex flex-col gap-4">
          <h3 className="text-2xl font-bold text-marrGold mb-4">Envíanos un mensaje</h3>
          <input type="text" placeholder="Nombre completo" className="rounded-md border-marrGold bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-marrGold focus:border-marrGold p-3" required />
          <input type="email" placeholder="Correo electrónico" className="rounded-md border-marrGold bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-marrGold focus:border-marrGold p-3" required />
          <textarea placeholder="Tu mensaje" rows={5} className="rounded-md border-marrGold bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-marrGold focus:border-marrGold p-3" required />
          <button type="submit" className="bg-marrGold text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-yellow-600 transition">Enviar mensaje</button>
        </form>
        {/* Datos de contacto */}
        <div className="flex flex-col gap-8 justify-center">
          <div>
            <h4 className="text-xl font-semibold text-marrGold mb-2">Datos de contacto</h4>
            <p className="text-gray-800 dark:text-gray-200">Correo: <a href="mailto:info@joyeriamarr.com" className="text-marrGold underline">info@joyeriamarr.com</a></p>
            <p className="text-gray-800 dark:text-gray-200">Teléfono: <a href="tel:+521234567890" className="text-marrGold underline">+52 123 456 7890</a></p>
            <p className="text-gray-800 dark:text-gray-200">Dirección: Av. de la Joya 123, CDMX, México</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-marrGold mb-2">Horario de atención</h4>
            <p className="text-gray-800 dark:text-gray-200">Lunes a Viernes: 10:00 - 19:00</p>
            <p className="text-gray-800 dark:text-gray-200">Sábados: 11:00 - 15:00</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-marrGold mb-2">Síguenos</h4>
            <div className="flex gap-4 mt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-marrGold hover:underline">Instagram</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-marrGold hover:underline">Facebook</a>
              <a href="https://wa.me/521234567890" target="_blank" rel="noopener noreferrer" className="text-marrGold hover:underline">WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      {/* MAPA */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="rounded-xl overflow-hidden shadow-lg border border-marrGold">
          <iframe
            title="Ubicación Joyeria MARR"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.123456789!2d-99.1234567!3d19.4326077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ff123456789%3A0x123456789abcdef!2sAv.+de+la+Joya+123,+CDMX!5e0!3m2!1ses-419!2smx!4v1710000000000!5m2!1ses-419!2smx"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default Contact; 