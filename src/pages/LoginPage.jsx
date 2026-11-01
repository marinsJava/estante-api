import { Navigate, useLocation } from 'react-router-dom';
import ActionButton from '../components/ActionButton.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useForm } from '../hooks/useForm.js';

const validate = ({ username, password }) => ({
  ...(!username.trim() && { username: 'Informe o usuário.' }),
  ...(!password && { password: 'Informe a senha.' }),
});

const LoginPage = () => {
  const { user, login } = useAuth();
  const { notify } = useToast();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? '/admin';

  const { values, errors, submitting, handleChange, handleSubmit } = useForm({
    initialValues: { username: '', password: '' },
    validate,
    onSubmit: async (credentials) => {
      try {
        await login(credentials); // ao logar, `user` muda e o <Navigate> abaixo redireciona
        return true;
      } catch (err) {
        notify(err.message, 'error');
        return false;
      }
    },
  });

  if (user) return <Navigate to={from} replace />;

  return (
    <section className="panel panel--narrow">
      <form className="form" onSubmit={handleSubmit} noValidate>
        <h2>Entrar</h2>
        <p className="muted">Acesso ao painel administrativo. Demo: <code>admin</code> / <code>estante123</code></p>
        <label>
          Usuário
          <input name="username" value={values.username} onChange={handleChange} autoComplete="username" aria-invalid={Boolean(errors.username)} />
          {errors.username && <small className="error">{errors.username}</small>}
        </label>
        <label>
          Senha
          <input name="password" type="password" value={values.password} onChange={handleChange} autoComplete="current-password" aria-invalid={Boolean(errors.password)} />
          {errors.password && <small className="error">{errors.password}</small>}
        </label>
        <ActionButton variant="primary" type="submit" disabled={submitting}>
          {submitting ? 'Entrando…' : 'Entrar'}
        </ActionButton>
      </form>
    </section>
  );
};

export default LoginPage;
