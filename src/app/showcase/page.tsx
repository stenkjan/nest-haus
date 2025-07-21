'use client';

import Link from 'next/link';
import { motion } from 'motion/react';

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Page Header */}
        <div className="text-center mb-16">
          <motion.h1 
            className="text-5xl font-bold text-gray-900 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Component Showcase
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Explore our comprehensive collection of responsive UI components. 
            From interactive card layouts to flexible grid systems, 
            discover components that adapt beautifully to any screen size and use case.
          </motion.p>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Cards Showcase */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Link href="/showcase/cards" className="group block">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:scale-[1.02]">
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 ml-4 group-hover:text-blue-600 transition-colors duration-300">
                      Card Components
                    </h2>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Interactive card layouts with responsive designs, glass effects, lightbox views, and seamless navigation. 
                    Perfect for showcasing content with style and elegance.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">Content Cards</span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">Glass Effects</span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">Lightbox Views</span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">Responsive</span>
                  </div>
                  <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                    <span className="font-medium">Explore Cards</span>
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Grids Showcase */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link href="/showcase/grids" className="group block">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:scale-[1.02]">
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 ml-4 group-hover:text-green-600 transition-colors duration-300">
                      Grid Components
                    </h2>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Flexible grid layouts including 2x2 interactive grids, 3x1 layouts, and full-width image grids. 
                    Designed for optimal content organization and visual hierarchy.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">2x2 Grids</span>
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">3x1 Layouts</span>
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">Full Width</span>
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">Adaptive</span>
                  </div>
                  <div className="flex items-center text-green-600 group-hover:text-green-700 transition-colors duration-300">
                    <span className="font-medium">Explore Grids</span>
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

        </div>

        {/* Additional Info */}
        <motion.div 
          className="text-center mt-16"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Component Features</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Fully Responsive Design
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Touch & Keyboard Navigation
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Smooth Animations
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Accessibility Ready
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
} 