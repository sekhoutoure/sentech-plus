'use client'

import { useEffect } from 'react';

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
    useEffect(() => {
        console.error('Error caught by boundary:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <div className="text-center max-w-md">
                <h2 className="text-3xl font-bold text-slate-800 mb-4">Oups ! Une erreur est survenue</h2>
                <p className="text-slate-600 mb-8">
                    Nous n'avons pas pu charger cette page. Veuillez réessayer.
                </p>
                <button
                    onClick={() => reset()}
                    className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors duration-300"
                >
                    Réessayer
                </button>
            </div>
        </div>
    );
}
