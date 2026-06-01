import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import './index.css';
import { Navbar } from './components/navbar';
import PaginaAlquileres from './pages/alquileres';
import PaginaInicio from './pages/inicio';
import PaginaClientes from './pages/clientes';
import PaginaVideojuegos from './pages/videojuegos';
import DetalleCliente from './pages/detalle-cliente';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />

      <main className='bg-gray-100 min-h-[calc(100vh-3.5rem)] py-4'>
        <Routes>
          <Route
            path='/'
            element={<PaginaInicio />}
          />
          <Route
            path='/clientes'
            element={<PaginaClientes />}
          />
          <Route
            path='/clientes/:cedula'
            element={<DetalleCliente />}
          />
          <Route
            path='/videojuegos'
            element={<PaginaVideojuegos />}
          />
          <Route
            path='/alquileres'
            element={<PaginaAlquileres />}
          />
        </Routes>
      </main>
    </BrowserRouter>
  </StrictMode>
);
