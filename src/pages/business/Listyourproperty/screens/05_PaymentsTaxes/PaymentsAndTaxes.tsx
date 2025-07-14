import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import sasulaLogo from '../../../../../logo/sasula_logo.png';
import mobileMoneyLogo from '../../../../../logo/mobile money.jpg';

interface StepProps {
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const PaymentsAndTaxes: React.FC<StepProps> = ({ data, onUpdate, onNext, onPrev }) => {
  const [paymentMethods, setPaymentMethods] = useState<string[]>(data.paymentMethods || []);
  const [taxRate, setTaxRate] = useState(data.taxRate || '');

  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement[]>([]);

  const paymentOptions = [
    {
      label: 'Mobile Money',
      value: 'Mobile Money',
      icon: mobileMoneyLogo,
    },
    {
      label: 'Sasula',
      value: 'Sasula',
      icon: sasulaLogo,
    },
  ];

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: -30, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }
    );

    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power2.out' }
    );

    gsap.fromTo(
      buttonsRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, delay: 0.6, ease: 'power2.out' }
    );

    // Animate each payment icon
    iconsRef.current.forEach((icon, index) => {
      gsap.fromTo(
        icon,
        { opacity: 0, y: 50, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          delay: 0.5 + index * 0.2,
          duration: 0.6,
          ease: 'back.out(1.7)',
        }
      );
    });
  }, []);

  const handlePaymentMethodsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let updatedMethods = [...paymentMethods];
    if (e.target.checked) {
      updatedMethods.push(value);
    } else {
      updatedMethods = updatedMethods.filter((method) => method !== value);
    }
    setPaymentMethods(updatedMethods);
    onUpdate({ paymentMethods: updatedMethods });
  };

  const handleTaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaxRate(e.target.value);
    onUpdate({ taxRate: e.target.value });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2
        ref={titleRef}
        className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent"
      >
        Payments & Taxes
      </h2>

      <form ref={formRef} className="space-y-10">
        <fieldset className="border border-gray-300 rounded-2xl p-6 bg-white/90 backdrop-blur-sm shadow-lg">
          <legend className="text-lg font-semibold text-gray-800 mb-4">
            Select Payment Methods
          </legend>

          <div className="flex flex-row gap-10 justify-center flex-wrap">
            {paymentOptions.map(({ label, value, icon }, index) => (
              <label
                key={value}
                className="flex flex-col items-center cursor-pointer group transition-transform duration-300 hover:scale-105"
                htmlFor={`pm-${value}`}
                ref={(el) => (iconsRef.current[index] = el!)}
              >
                <input
                  type="checkbox"
                  id={`pm-${value}`}
                  value={value}
                  checked={paymentMethods.includes(value)}
                  onChange={handlePaymentMethodsChange}
                  className="hidden peer"
                />
                <div
                  className="w-48 h-48 rounded-xl border-2 border-gray-300 overflow-hidden
                  peer-checked:border-teal-600 peer-checked:ring-4 peer-checked:ring-teal-300
                  transition-all duration-300 flex items-center justify-center bg-white shadow-md"
                >
                  <img
                    src={icon}
                    alt={`${label} Logo`}
                    className="w-full h-full object-contain"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://sasula.co.ug/wp-content/uploads/2020/12/cropped-sasula-favicon-32x32.png';
                    }}
                  />
                </div>
                <span className="mt-3 text-lg font-medium text-gray-700 peer-checked:text-teal-700 transition-colors duration-300">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
          <label
            htmlFor="taxRate"
            className="block mb-3 font-semibold text-gray-800 text-lg"
          >
            Tax Rate (%)
          </label>
          <input
            id="taxRate"
            type="number"
            value={taxRate}
            onChange={handleTaxRateChange}
            min={0}
            max={100}
            placeholder="Enter tax rate"
            className="w-full text-lg px-5 py-3 rounded-xl border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all outline-none"
          />
        </div>
      </form>

      <div
        ref={buttonsRef}
        className="flex justify-between items-center mt-10"
      >
        <button
          onClick={onPrev}
          type="button"
          className="px-10 py-4 text-gray-600 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-lg font-semibold"
        >
          ← Previous
        </button>
        <button
          onClick={onNext}
          type="button"
          className="px-12 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-green-600 hover:to-teal-700"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default PaymentsAndTaxes;
