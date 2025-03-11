import { useState } from 'react';

export default function Home() {
  const [apiResponse, setApiResponse] = useState<string>('');

  const handleLogin = () => {
    window.location.href = '/api/auth/login';
  };

  const handleLogout = () => {
    window.location.href = '/api/auth/logout';
  };

  const checkProtectedApi = async () => {
    try {
      const response = await fetch('/api/protected');
      const data = await response.json();
      setApiResponse(data.message);
    } catch {
      setApiResponse('Error: Not authenticated');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-8">SAML Authentication Demo</h1>
      <div className="space-y-4">
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Login with Keycloak
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
        >
          Logout
        </button>
        <button
          onClick={checkProtectedApi}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
        >
          Check Protected API
        </button>
      </div>
      {apiResponse && (
        <div className="mt-8 p-4 bg-gray-100 rounded">
          <p>{apiResponse}</p>
        </div>
      )}
    </div>
  );
}
