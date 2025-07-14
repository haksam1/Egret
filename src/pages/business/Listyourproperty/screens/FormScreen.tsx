import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
interface FormValues {
  address: string;
  postalCode: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

interface FormScreenProps {
  formValues: FormValues;
  setFormValues: (values: FormValues) => void;
  setScreen: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}

const FormScreen: React.FC<FormScreenProps> = ({
  formValues,
  setFormValues,
  setScreen,
  onSubmit,
  isSubmitting,
  submitError,
}) => {
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      {
        opacity: 0,
        y: 60,
        rotateX: 15,
        scale: 0.95,
        transformPerspective: 1000,
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        duration: 1.4,
        ease: 'power3.out',
      }
    );
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center px-4">
      <div
        ref={formRef}
        className="transition-transform duration-300 hover:scale-[1.01] bg-white shadow-2xl rounded-2xl w-full max-w-4xl px-10 py-12 border border-gray-200"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          📬 Contact & Address Details
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input fields */}
          {[
            { label: 'Address', name: 'address', type: 'text', value: formValues.address },
            // { label: 'Postal Code', name: 'postalCode', type: 'text', value: formValues.postalCode },
            { label: 'Contact Name', name: 'contactName', type: 'text', value: formValues.contactName },
            { label: 'Contact Email', name: 'contactEmail', type: 'email', value: formValues.contactEmail },
            { label: 'Contact Phone', name: 'contactPhone', type: 'tel', value: formValues.contactPhone },
          ].map(({ label, name, type, value }) => (
            <div key={name} className="flex flex-col gap-2">
              <label htmlFor={name} className="text-gray-700 font-medium">
                {label}
              </label>
              <input
                id={name}
                type={type}
                name={name}
                value={value}
                onChange={handleChange}
                required
                className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          ))}

          {/* Submit */}
          <div className="md:col-span-2 mt-6">
            {submitError && (
              <p className="text-red-600 text-center font-medium mb-4">
                {submitError}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 font-semibold text-lg rounded-xl transition-all ${
                isSubmitting
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-teal-500 text-white hover:scale-105 hover:shadow-xl'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormScreen;
