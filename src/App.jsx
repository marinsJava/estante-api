import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import BookDetailsPage from './pages/BookDetailsPage.jsx';
import BookFormPage from './pages/BookFormPage.jsx';
import DiscoverPage from './pages/DiscoverPage.jsx';
import LibraryPage from './pages/LibraryPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

const AdminPage = lazy(() => import('./pages/AdminPage.jsx'));

const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<LibraryPage />} />
      <Route path="livros/novo" element={<BookFormPage />} />
      <Route path="livros/:id" element={<BookDetailsPage />} />
      <Route path="livros/:id/editar" element={<BookFormPage />} />
      <Route path="descobrir" element={<DiscoverPage />} />
      <Route path="login" element={<LoginPage />} />

      <Route element={<PrivateRoute />}>
        <Route
          path="admin"
          element={
            <Suspense fallback={<p className="state" aria-busy="true"><span className="spinner" aria-hidden="true" />Carregando painel…</p>}>
              <AdminPage />
            </Suspense>
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);

export default App;
