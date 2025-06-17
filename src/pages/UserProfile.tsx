import React from 'react';

const UserProfile: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-800">Tu Perfil</h1>
      <p className="mt-4 text-lg text-gray-600">Gestiona la información de tu cuenta.</p>
      {/* Aquí se mostrará la información del perfil del usuario */}
    </div>
  );
};

export default UserProfile; 