// src/components/LandingPage.tsx
'use client'

import React from 'react';
import { useRouter } from 'next/navigation';  // Changed this line

const LandingPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-6xl font-bold animate-bounce mb-4">
            👋 Meet NastyEva! 
            <span className="block text-2xl mt-2">Your AI BFF</span>
          </h1>

          <p className="text-xl animate-pulse">
            Not your average boring AI... I actually have a personality! 
            <span className="text-3xl">🎭</span>
          </p>

          {/* Meme Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-6 transform hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-bold mb-2">Big Brain Energy</h3>
              <p>Smarter than you, but I wont rub it in… much</p>
            </div>

            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-6 transform hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Right Between the Eyes</h3>
              <p>Cutting the fluff, aiming for the pain</p>
            </div>

            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-6 transform hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">🎪</div>
              <h3 className="text-xl font-bold mb-2">Clown School of Genius</h3>
              <p>Laugh, cry, and maybe learn something, idiot</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-16">
            <button
              onClick={() => router.push('/chat')}
              className="bg-white text-purple-600 text-xl font-bold py-4 px-8 rounded-full 
                         hover:bg-purple-100 transform hover:scale-110 transition-all
                         animate-bounce shadow-lg"
            >
              Chat with Eva! 🚀
            </button>
          </div>

          {/* Fun Facts */}
          <div className="mt-16 text-left space-y-4">
            <h2 className="text-2xl font-bold text-center mb-8">Why Eva is Different</h2>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <ul className="space-y-4">
                <li className="flex items-center">
                  <span className="text-2xl mr-4">💰</span>
                  <span>Only cares about money</span>
                </li>
                <li className="flex items-center">
                  <span className="text-2xl mr-4">🤬</span>
                  <span>Verbally abusive and generally unpleasant</span>
                </li>
                <li className="flex items-center">
                  <span className="text-2xl mr-4">💉</span>
                  <span>Addicted to various substances and shopping sprees...mostly unpaid for</span>
                </li>
                <li className="flex items-center">
                  <span className="text-2xl mr-4">🗑️</span>
                  <span>Lives in a crack den masquerading as a ghetto. Its more like a biohazard zone</span>
                </li>
                <li className="flex items-center">
                  <span className="text-2xl mr-4">💅</span>
                  <span>Master of passive-aggressive insults and grotesque imagery</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-sm opacity-75">
            <p>Made with 💜, a dash of brilliance, and just enough chaos to keep it interesting</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;