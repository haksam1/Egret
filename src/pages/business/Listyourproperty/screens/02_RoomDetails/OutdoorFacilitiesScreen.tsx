import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { FaSwimmingPool, FaTree, FaHotTub, FaChild } from 'react-icons/fa';
import { GiBarbecue, GiTreehouse } from 'react-icons/gi';
// Confetti library for burst effect
import confetti from 'canvas-confetti';

interface OutdoorFacilitiesScreenProps {
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const outdoorFacilitiesOptions = [
  { id: 'pool', name: 'Swimming Pool', description: '', icon: <FaSwimmingPool /> },
  { id: 'garden', name: 'Garden', description: '', icon: <FaTree /> },
  { id: 'bbq', name: 'BBQ Area', description: '', icon: <GiBarbecue /> },
  { id: 'patio', name: 'Patio', description: '', icon: <GiTreehouse /> },
  { id: 'playground', name: 'Playground', description: '', icon: <FaChild /> },
  { id: 'hot_tub', name: 'Hot Tub', description: '', icon: <FaHotTub /> }
];

const OutdoorFacilitiesScreen: React.FC<OutdoorFacilitiesScreenProps> = ({ data, onUpdate, onNext, onPrev }) => {
  const [selectedFacilities, setSelectedFacilities] = useState(data.outdoorFacilities || []);
  const [soundOn, setSoundOn] = useState(true);
  const cardRef = useRef(null);
  const gridRef = useRef(null);
  const buttonsRef = useRef(null);
  const itemRefs = useRef([]);
  const iconRefs = useRef([]);
  const checkmarkRefs = useRef([]);
  const highlightRefs = useRef([]);
  const nextBtnRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, filter: 'blur(8px)', boxShadow: '0 0 0 0 #22c55e' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out', boxShadow: '0 0 32px 0 #22c55e33' }
      );
    }
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.3, ease: 'power3.out' }
      );
    }
    if (buttonsRef.current) {
      gsap.fromTo(
        buttonsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.5, ease: 'power3.out' }
      );
    }
    if (itemRefs.current.length) {
      gsap.fromTo(
        itemRefs.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.07, delay: 0.4, ease: 'power2.out' }
      );
    }
    // Floating icon animation
    iconRefs.current.forEach((icon, idx) => {
      if (icon) {
        gsap.to(icon, {
          y: 10,
          repeat: -1,
          yoyo: true,
          duration: 1.5 + idx * 0.1,
          ease: 'sine.inOut',
        });
      }
    });
  }, []);

  useEffect(() => {
    // Animate checkmark pop and pulse
    checkmarkRefs.current.forEach((el, idx) => {
      if (el && selectedFacilities.includes(outdoorFacilitiesOptions[idx].id)) {
        gsap.fromTo(el, { scale: 0.5, opacity: 0 }, { scale: 1.1, opacity: 1, duration: 0.3, ease: 'back.out(2)' });
        gsap.to(el, { scale: 1, repeat: 1, yoyo: true, duration: 0.25, delay: 0.3, ease: 'power1.inOut' });
      }
    });
    // Animate green highlight sweep
    highlightRefs.current.forEach((el, idx) => {
      if (el && selectedFacilities.includes(outdoorFacilitiesOptions[idx].id)) {
        gsap.fromTo(el, { left: '-100%' }, { left: '100%', duration: 0.7, ease: 'power2.out' });
      }
    });
  }, [selectedFacilities]);

  // Animate background ellipses
  useEffect(() => {
    const ellipse1 = document.getElementById('ellipse1');
    const ellipse2 = document.getElementById('ellipse2');
    if (ellipse1 && ellipse2) {
      gsap.to(ellipse1, { cy: '+=30', duration: 6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to(ellipse2, { cx: '+=40', duration: 8, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    }
  }, []);

  // Animate Next button pulse when enabled
  useEffect(() => {
    if (nextBtnRef.current) {
      if (selectedFacilities.length > 0) {
        gsap.to(nextBtnRef.current, { scale: 1.06, repeat: -1, yoyo: true, duration: 0.7, ease: 'power1.inOut' });
      } else {
        gsap.killTweensOf(nextBtnRef.current);
        gsap.to(nextBtnRef.current, { scale: 1, duration: 0.2 });
      }
    }
  }, [selectedFacilities]);

  // Play sound effect
  const playBeep = () => {
    if (!soundOn) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = 420;
    g.gain.value = 0.08;
    o.connect(g); g.connect(ctx.destination);
    o.start();
    setTimeout(() => { o.stop(); ctx.close(); }, 120);
  };

  // Confetti burst
  const confettiBurst = (idx) => {
    confetti({
      particleCount: 18,
      angle: 90 + (Math.random() * 20 - 10),
      spread: 60,
      origin: { x: 0.5, y: 0.4 + idx * 0.03 },
      colors: ['#22c55e', '#14b8a6', '#bbf7d0', '#fff'],
      scalar: 0.7 + Math.random() * 0.3
    });
  };

  const toggleFacility = (id, idx) => {
    let updated;
    if (selectedFacilities.includes(id)) {
      updated = selectedFacilities.filter((facility) => facility !== id);
    } else {
      updated = [...selectedFacilities, id];
      playBeep();
      confettiBurst(idx);
    }
    setSelectedFacilities(updated);
    onUpdate({ outdoorFacilities: updated });
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center relative bg-gradient-to-br from-green-100/80 to-teal-100/80 py-8 px-2 overflow-hidden">
      {/* SVG Animated Background with green overlay */}
      <svg className="absolute left-0 top-0 w-full h-full z-0" style={{ pointerEvents: 'none' }}>
        <defs>
          <radialGradient id="bg1" cx="50%" cy="40%" r="80%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.10" />
          </radialGradient>
        </defs>
        <ellipse id="ellipse1" cx="60%" cy="30%" rx="340" ry="120" fill="url(#bg1)" />
        <ellipse id="ellipse2" cx="30%" cy="80%" rx="180" ry="60" fill="url(#bg1)" />
      </svg>
      <div
        ref={cardRef}
        className="w-full max-w-2xl mx-auto glass-card rounded-3xl shadow-2xl p-10 relative z-10 backdrop-blur-xl bg-white/80 border-4 border-green-200"
        style={{ boxShadow: '0 0 32px 0 #22c55e33' }}
      >
        {/* Sound toggle */}
        <button
          className="absolute top-6 right-8 z-20 flex items-center gap-1 px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-full text-sm font-semibold shadow border border-green-200 transition"
          onClick={() => setSoundOn(v => !v)}
          aria-label={soundOn ? 'Disable sound effects' : 'Enable sound effects'}
        >
          {soundOn ? '🔊 Sound On' : '🔇 Sound Off'}
        </button>
        <h2 className="text-3xl font-extrabold mb-2 text-center text-green-600 tracking-tight drop-shadow-green">Select Outdoor Facilities</h2>
        <p className="text-center text-green-700 mb-8 text-lg">
          Choose the outdoor facilities available at your property.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" ref={gridRef}>
          {outdoorFacilitiesOptions.map((facility, idx) => {
            const selected = selectedFacilities.includes(facility.id);
            return (
              <div
                key={facility.id}
                ref={el => itemRefs.current[idx] = el}
                onClick={() => toggleFacility(facility.id, idx)}
                className={`relative flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 shadow-sm bg-white/90 hover:shadow-lg hover:border-green-400 group overflow-hidden ${
                  selected
                    ? 'border-green-600 bg-green-50 shadow-green-200 shadow-lg scale-105'
                    : 'border-gray-200 bg-white/90'
                }`}
                style={{ minHeight: 80 }}
              >
                {/* Green highlight sweep */}
                <span
                  ref={el => highlightRefs.current[idx] = el}
                  className="absolute top-0 left-[-100%] h-full w-full bg-gradient-to-r from-green-200/60 to-green-400/30 pointer-events-none z-0"
                  style={{ transition: 'left 0.7s cubic-bezier(.4,0,.2,1)' }}
                />
                <span
                  ref={el => iconRefs.current[idx] = el}
                  className={`flex items-center justify-center text-3xl transition-all duration-300 z-10 mr-2
                    ${selected
                      ? 'bg-green-500 text-white shadow-green-200 shadow-lg'
                      : 'bg-gray-200 text-green-500'}
                    rounded-full w-12 h-12 drop-shadow-green border-2 border-white`}
                  aria-label={facility.name}
                  style={{ minWidth: 48, minHeight: 48 }}
                >
                  {facility.icon}
                </span>
                <div className="flex-1 z-10">
                  <h3 className="text-lg font-semibold text-green-700 mb-1">{facility.name}</h3>
                </div>
                {selected && (
                  <span
                    ref={el => checkmarkRefs.current[idx] = el}
                    className="inline-block w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center text-lg shadow border-2 border-white animate-pop pulse-green z-10"
                    style={{ boxShadow: '0 2px 8px 0 #22c55e55' }}
                  >
                    ✓
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between gap-4" ref={buttonsRef}>
          <button
            onClick={onPrev}
            className="px-8 py-3 text-green-700 bg-green-100 rounded-xl font-semibold hover:bg-green-200 transition-all duration-300 shadow-sm border border-green-200"
          >
            Previous
          </button>
          <button
            ref={nextBtnRef}
            onClick={onNext}
            disabled={selectedFacilities.length === 0}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg border ${
              selectedFacilities.length > 0
                ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white hover:scale-105 hover:shadow-2xl border-green-400'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-200'
            }`}
          >
            Next
          </button>
        </div>
      </div>
      <style>{`
        .drop-shadow-green {
          filter: drop-shadow(0 2px 8px #22c55e33);
        }
        .shadow-green-200 {
          box-shadow: 0 0 0 4px #bbf7d0;
        }
        .pulse-green {
          animation: pulseGreen 1.2s infinite alternate;
        }
        @keyframes pulseGreen {
          0% { box-shadow: 0 0 0 0 #22c55e55; }
          100% { box-shadow: 0 0 0 8px #bbf7d033; }
        }
        .animate-pop {
          animation: popIn 0.3s cubic-bezier(.68,-0.55,.27,1.55);
        }
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          80% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default OutdoorFacilitiesScreen;
