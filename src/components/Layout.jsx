import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import ActionButton from './ActionButton.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const linkClass = ({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`;

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app">
      <header className="app__header">
        <Link to="/" className="brand">Estante</Link>
        <nav className="nav" aria-label="Principal">
          <NavLink to="/" end className={linkClass}>Biblioteca</NavLink>
          <NavLink to="/descobrir" className={linkClass}>Descobrir</NavLink>
          <NavLink to="/admin" className={linkClass}>Admin</NavLink>
        </nav>
        <div className="nav__user">
          {user ? (
            <>
              <span className="muted">Olá, {user.name}</span>
              <ActionButton onClick={handleLogout}>Sair</ActionButton>
            </>
          ) : (
            <Link className="btn btn--ghost" to="/login">Entrar</Link>
          )}
        </div>
      </header>
      <Outlet />
    </div>
  );
};

export default Layout;
