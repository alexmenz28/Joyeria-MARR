import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await api.post('/api/Auth/register', {
        nombre,
        email,
        password,
        confirmPassword,
      });
      setSuccess(response.data.message || 'Registro exitoso. ¡Ahora puedes iniciar sesión!');
      // Redirigir al usuario a la página de login después de un registro exitoso
      setTimeout(() => {
        navigate('/iniciar-sesion');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar usuario.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 pt-8 transition-colors">
      <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-marrGold">
            Regístrate para crear una cuenta
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="nombre" className="sr-only">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-marrGold placeholder-gray-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 rounded-t-md focus:outline-none focus:ring-marrGold focus:border-marrGold focus:z-10 sm:text-sm"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Dirección de Email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-marrGold placeholder-gray-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-marrGold focus:border-marrGold focus:z-10 sm:text-sm"
                placeholder="Dirección de Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-marrGold placeholder-gray-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-marrGold focus:border-marrGold focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">Confirmar Contraseña</label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-marrGold placeholder-gray-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 rounded-b-md focus:outline-none focus:ring-marrGold focus:border-marrGold focus:z-10 sm:text-sm"
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Éxito: </strong>
              <span className="block sm:inline">{success}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-marrGold text-sm font-medium rounded-md text-white bg-marrGold hover:bg-marrGold/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-marrGold shadow"
            >
              Regístrate
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            ¿Ya tienes una cuenta? <a href="/iniciar-sesion" className="font-medium text-marrGold hover:text-marrGold/80">Inicia sesión aquí</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 