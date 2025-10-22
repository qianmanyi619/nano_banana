export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-orange-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Error</h1>
        <p className="text-gray-600 mb-6">
          Sorry, we couldn't complete your authentication. This could be due to:
        </p>
        <ul className="text-left text-gray-600 mb-6 space-y-2">
          <li>• The authentication code has expired</li>
          <li>• The authentication was cancelled</li>
          <li>• There was a network error</li>
        </ul>
        <a
          href="/"
          className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          Return to Home
        </a>
      </div>
    </div>
  )
}