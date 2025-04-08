'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import bgarch from '@/assets/pink-background.jpg'; // 👈 Import background image

export default function DeleteAccountPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmed) return;

    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        sessionStorage.removeItem('username');
        router.push('/');
        window.location.reload();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete account.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bgarch.src})` }}
    >
      <div className="max-w-md w-full bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-red-600 text-center">Delete Account</h2>
        <p className="mb-4 text-gray-700 text-center">
          Deleting your account is irreversible. All your data will be permanently removed.
        </p>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <button
          onClick={handleDelete}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
        >
          Delete My Account
        </button>
      </div>
    </div>
  );
}
