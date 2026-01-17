import React from 'react';
import { Award } from 'lucide-react';

export default function SplashScreen() {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0f172a] text-white">
            <div className="relative">
                {/* Animated Background Pulse */}
                <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-3xl animate-pulse scale-150"></div>

                {/* Logo Container */}
                <div className="relative bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl animate-zoomIn">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-2xl shadow-lg animate-bounce-slow">
                        <Award className="w-16 h-16 text-white" />
                    </div>
                </div>
            </div>

            {/* Text Overlay */}
            <div className="mt-12 text-center space-y-3 animate-fadeInUp">
                <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">
                    SkillSwap
                </h1>
                <p className="text-indigo-300/60 font-medium tracking-[0.2em] uppercase text-xs">
                    Search and find the skills you need
                </p>
            </div>

            {/* Progress Bar */}
            <div className="mt-16 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 animate-loading-bar rounded-full"></div>
            </div>
        </div>
    );
}
