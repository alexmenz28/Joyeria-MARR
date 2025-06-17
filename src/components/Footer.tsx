import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-8">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Joyería MARR. Todos los derechos reservados.</p>
        <p className="text-sm mt-2">
          Síguenos en:
          <a href="#" className="text-blue-400 hover:underline ml-2">Facebook</a> |
          <a href="#" className="text-blue-400 hover:underline ml-2">Instagram</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer; 