import { useEffect, useState } from 'react';

const apiBaseUrl = 'http://localhost:3001';

export default function App() {
  const [comment, setComment] = useState('<b>Comentario inicial inseguro</b>');
  const [previewHtml, setPreviewHtml] = useState('<b>Comentario inicial inseguro</b>');
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
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
    setPreviewHtml(comment);

    try {
      const response = await fetch(`${apiBaseUrl}/comments/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment })
      });
      const data = await response.json();
      setPreviewHtml(data.rawHtml);
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
      setSearchResult(data);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Projeto inseguro para fins educacionais/teste</p>
        <h1>Laboratorio Fullstack para AppSec</h1>
        <p className="lead">
          Esta interface consome uma API Express vulneravel e renderiza HTML sem sanitizacao.
          Use apenas em ambiente controlado.
        </p>
      </section>

      <section className="grid">
        <article className="panel">
          <h2>XSS Intencional</h2>
          <p>
            VULNERABILIDADE INTENCIONAL: o conteudo abaixo e inserido no DOM com dangerouslySetInnerHTML.
          </p>
          <textarea
            rows="5"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Digite HTML arbitrario"
          />
          <button onClick={handlePreview}>Renderizar sem sanitizacao</button>
          <div className="preview-box" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </article>

        <article className="panel">
          <h2>Login vulneravel</h2>
          <p>
            VULNERABILIDADE INTENCIONAL: nenhum campo e validado, nao ha CSRF e o backend usa SQL concatenado.
          </p>
          <form onSubmit={handleLogin} className="stack">
            <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
            <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Senha" />
            <button type="submit">Entrar</button>
          </form>
          {loginResult ? <pre>{JSON.stringify(loginResult, null, 2)}</pre> : null}
        </article>

        <article className="panel">
          <h2>Busca vulneravel</h2>
          <p>Use o endpoint de busca para validar deteccao de SQL Injection.</p>
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
                <div dangerouslySetInnerHTML={{ __html: user.bio }} />
              </li>
            ))}
          </ul>
        </article>
      </section>

      {error ? <p className="error-box">Erro: {error}</p> : null}
    </main>
  );
}
