'use client'

export default function Error({ error, reset }) {
  console.error('Error boundary caught:', error)

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0f172a', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          color: 'white', 
          marginBottom: '1rem' 
        }}>
          Something went wrong!
        </h2>
        <button
          onClick={() => reset()}
          style={{
            backgroundColor: '#7c3aed',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Try again
        </button>
      </div>
    </div>
  )
}
