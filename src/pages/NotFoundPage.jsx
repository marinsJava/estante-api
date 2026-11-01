import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <section className="panel panel--narrow">
    <h2>Página não encontrada</h2>
    <p className="muted">O endereço não existe. <Link to="/">Voltar à biblioteca</Link></p>
  </section>
);

export default NotFoundPage;
