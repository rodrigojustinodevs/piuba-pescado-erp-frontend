'use client';

// Substitui o root layout em caso de falha grave: sem providers nem CSS global garantidos.
export default function GlobalError({
  reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          minHeight: '100vh',
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          textAlign: 'center',
          padding: 24,
        }}
      >
        <h1 style={{ fontSize: 24, margin: 0 }}>Algo deu errado</h1>
        <p style={{ maxWidth: 420, margin: 0, color: '#64748b' }}>
          Ocorreu um erro grave na aplicação. Tente recarregar a página.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            padding: '8px 16px',
            borderRadius: 6,
            border: 0,
            background: '#16a34a',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Tentar novamente
        </button>
      </body>
    </html>
  );
}
