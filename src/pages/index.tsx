
import React from 'react';
import { Link } from 'react-router-dom';

const Index: React.FC = () => {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative h-screen max-h-[100vh] min-h-[600px]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('src/backgroundsimages/waterfall.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/80"></div>
        </div>

        <div className="relative h-full flex flex-col items-center justify-center px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400 animate-gradient">
                Discover
              </span>{" "}
              Luxury & Adventure
            </h1>

            <p className="text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto leading-relaxed">
              Immerse yourself in breathtaking destinations, gourmet cuisine, and
              unforgettable experiences.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 animate-slide-up">
              <Link
                to="/business/register"
                className="inline-flex items-center px-8 py-3.5 border border-transparent text-lg font-semibold rounded-lg shadow-lg text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
              >
                Add your business
                <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
