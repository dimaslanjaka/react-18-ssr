import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('./pages/index'));
const Thinking = lazy(() => import('./pages/thinking'));
const NotFound = lazy(() => import('./components/NotFound'));
const Navbar = lazy(() => import('./components/Navbar'));
const Footer = lazy(() => import('./components/Footer'));

const ROUTES = [
  {
    path: '/',
    element: (
      <Suspense>
        <Home />
      </Suspense>
    ),
  },
  {
    path: '/thinking',
    element: (
      <Suspense>
        <Thinking />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense>
        <NotFound />
      </Suspense>
    ),
  },
];

export default function AppRoutes() {
  if (typeof window === 'undefined') {
    return (
      <Routes>
        {ROUTES.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    );
  }

  return (
    <BrowserRouter basename="/chimeraland">
      <Routes>
        {ROUTES.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}
