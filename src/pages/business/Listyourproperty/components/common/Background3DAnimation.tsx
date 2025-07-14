import React from 'react';

const Background3DAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-green-400">
      {/* Layer 1: Rotating gradient background */}
      <div className="w-full h-full animate-rotate-3d bg-gradient-to-r from-green-400 via-teal-400 to-green-500 opacity-90"></div>

      {/* Layer 2: Floating translucent circles */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          <circle className="animate-float-slow" cx="20%" cy="30%" r="60" fill="rgba(255, 255, 255, 0.15)" />
          <circle className="animate-float" cx="70%" cy="50%" r="80" fill="rgba(255, 255, 255, 0.12)" />
          <circle className="animate-float-slower" cx="50%" cy="80%" r="100" fill="rgba(255, 255, 255, 0.1)" />
        </svg>
      </div>

      {/* Layer 3: Subtle moving stripes */}
      <div className="absolute inset-0 w-full h-full bg-stripes opacity-30 animate-stripes-move"></div>

      <style>{`
        @keyframes rotate3d {
          0% {
            transform: rotateX(0deg) rotateY(0deg);
          }
          50% {
            transform: rotateX(15deg) rotateY(15deg);
          }
          100% {
            transform: rotateX(0deg) rotateY(0deg);
          }
        }
        .animate-rotate-3d {
          animation: rotate3d 20s linear infinite;
          transform-style: preserve-3d;
          will-change: transform;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes float-slower {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 10s ease-in-out infinite;
        }

        /* Stripes background */
        .bg-stripes {
          background-image: repeating-linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.05),
            rgba(255, 255, 255, 0.05) 10px,
            transparent 10px,
            transparent 20px
          );
        }
        @keyframes stripes-move {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 40px 40px;
          }
        }
        .animate-stripes-move {
          animation: stripes-move 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Background3DAnimation;
