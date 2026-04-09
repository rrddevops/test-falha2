import { useEffect, useState } from 'react';

const apiBaseUrl = 'http://localhost:3001';

export default function App() {
  const [comment, setComment] = useState('Comentario inicial seguro');
  const [previewText, setPreviewText] = useState('Comentario inicial seguro');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [term, setTerm] = useState('admin');
  const [loginResult, setLoginResult] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${apiBaseUrl}/users`)
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((requestError) => setError(requestError.message));
  }, []);

  async function handlePreview() {
    setPreviewText(comment);

    try {
      const response = await fetch(`${apiBaseUrl}/comments/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment })
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Falha ao gerar preview');
        return;
      }

      setPreviewText(data.previewText);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch(`${apiBaseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Falha no login');
        setLoginResult(null);
        return;
      }

      setLoginResult(data);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleSearch(event) {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch(`${apiBaseUrl}/search?term=${encodeURIComponent(term)}`);
      const data = await response.json();

       if (!response.ok) {
        setError(data.error || 'Falha na busca');
        setSearchResult(null);
        return;
      }

      setSearchResult(data);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Branch de reteste AppSec</p>
        <h1>Laboratorio Fullstack corrigido</h1>
        <p className="lead">
          Esta interface consome uma API Express corrigida para retestar a esteira de seguranca.
          Use apenas em ambiente controlado para comparacao com o branch vulneravel.
        </p>
      </section>

      <section className="grid">
        <article className="panel">
          <h2>Preview seguro</h2>
          <p>
            O conteudo digitado e exibido como texto simples para evitar execucao de HTML no navegador.
          </p>
          <textarea
            rows="5"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Digite texto para o preview"
          />
          <button onClick={handlePreview}>Gerar preview seguro</button>
          <div className="preview-box">{previewText}</div>
        </article>

        <article className="panel">
          <h2>Login</h2>
          <p>
            O backend agora valida entrada, usa query parametrizada e gera JWT com expiracao.
          </p>
          <form onSubmit={handleLogin} className="stack">
            <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Senha" />
            <button type="submit">Entrar</button>
          </form>
          {loginResult ? <pre>{JSON.stringify(loginResult, null, 2)}</pre> : null}
        </article>

        <article className="panel">
          <h2>Busca</h2>
          <p>A busca usa parametros preparados no backend e nao expoe a query executada.</p>
          <form onSubmit={handleSearch} className="stack">
            <input value={term} onChange={(event) => setTerm(event.target.value)} placeholder="Termo de busca" />
            <button type="submit">Buscar</button>
          </form>
          {searchResult ? <pre>{JSON.stringify(searchResult, null, 2)}</pre> : null}
        </article>

        <article className="panel">
          <h2>Usuarios seed</h2>
          <ul className="user-list">
            {users.map((user) => (
              <li key={user.id}>
                <strong>{user.email}</strong>
                <span>{user.role}</span>
                <div>{user.bio}</div>
              </li>
            ))}
          </ul>
        </article>
      </section>

      {error ? <p className="error-box">Erro: {error}</p> : null}
    </main>
  );
}
