export default function Loading() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0f172a', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          border: '2px solid #374151',
          borderTop: '2px solid #7c3aed',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem auto'
        }}></div>
        <p style={{ 
          color: 'white', 
          fontSize: '1.125rem', 
          fontWeight: '500' 
        }}>
          Loading tool details...
        </p>
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `
        }} />
      </div>
    </div>
  )
}
