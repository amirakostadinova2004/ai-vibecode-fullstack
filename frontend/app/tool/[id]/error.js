'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ToolError({ error, reset }) {
  const router = useRouter()

  useEffect(() => {
    console.error('Tool page error:', error)
  }, [error])

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
          Error loading tool
        </h2>
        <p style={{ 
          color: '#cbd5e1', 
          marginBottom: '1.5rem' 
        }}>
          Something went wrong while loading the tool details
        </p>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center' 
        }}>
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
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              backgroundColor: '#475569',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
