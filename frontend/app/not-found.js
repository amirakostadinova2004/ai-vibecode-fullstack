import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Not Found</h2>
        <p className="text-slate-300 mb-6">Could not find requested resource</p>
        <Link
          href="/dashboard"
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  )
}
