import React from 'react';

interface ThankYouStepProps {
  businessName: string;
  contactEmail: string;
  contactPhone: string;
  businessType: string;
  registrationAuthority: string;
  physicalAddress: string;
  primaryContact: {
    name: string;
    email: string;
    phone: string;
  };
  primaryBankAccount: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    branch: string;
    accountType: string;
  };
  registrationStatus?: string;
  imageUrl?: string; // base64 or url
}

const ThankYouStep: React.FC<ThankYouStepProps> = ({
  businessName = '',
  contactEmail = '',
  contactPhone = '',
  businessType = '',
  registrationAuthority = '',
  physicalAddress = '',
  registrationStatus = 'Pending Review',
  imageUrl = '',
}) => (
  <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-0">
    {/* Header Section with optional image */}
    <div className="bg-gradient-to-r from-[#00AEEF] to-[#0079C1] p-6 text-white">
      <h1 className="text-2xl font-bold mb-2">Registration Submitted Successfully!</h1>
      <p className="opacity-90">Your application is now being processed</p>
    </div>

    {/* Content Section */}
    <div className="p-6">
      {/* Greeting */}
      <div className="mb-6">
        <p className="text-lg text-gray-700 mb-4">
          <span className="font-semibold text-gray-900">
            Dear {contactEmail ? contactEmail.split('@')[0].replace(/\./g, ' ').toUpperCase() : 'Valued Registrant'},
          </span>
        </p>
        <div className="space-y-3 text-gray-600">
          <p>
            Thank you for registering <span className="font-semibold text-gray-800">{businessName}</span> with the Egret System.
          </p>
          <p>
            Your application has been received and is currently <span className="font-medium text-teal-700">awaiting review</span> by our administrative team.
          </p>
          <p>
            Once approved, you will receive a confirmation email with further details on how to access the system.
          </p>
        </div>
      </div>

      {/* Business Details Card */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-5 mb-6 border border-teal-200">
        <div className="flex items-center mb-4">
          <div className="bg-gradient-to-r from-[#00AEEF] to-[#0079C1] p-2 rounded-full mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-teal-800">Business Details</h2>
        </div>
        {imageUrl && (
          <div className="flex justify-center mb-6">
            <img
              src={imageUrl}
              alt="Business Logo"
              className="h-64 w-64 object-cover rounded-lg border-4 border-white shadow-lg"
              style={{ aspectRatio: '1 / 1' }}
            />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailItem label="Business Name" value={businessName} />
          <DetailItem label="Contact Email" value={contactEmail} />
          <DetailItem label="Contact Phone" value={contactPhone} />
          <DetailItem label="Business Type" value={businessType} />
          <DetailItem label="Registration Authority" value={registrationAuthority} />
          <DetailItem label="Physical Address" value={physicalAddress} />
          <DetailItem label="Registration Status" value={registrationStatus} highlight />
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-[#00AEEF] to-[#0079C1] rounded-lg p-5 mb-6 border border-[#00AEEF] text-white">
        <div className="flex items-center mb-3">
          <div className="bg-white p-2 rounded-full mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00AEEF]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white">What Happens Next?</h3>
        </div>
        <ul className="list-disc pl-5 space-y-2">
          <li>Our team will review your application within 2-3 business days</li>
          <li>You'll receive an email notification once approved</li>
          <li>Check your spam folder if you don't see our emails</li>
        </ul>
      </div>

      {/* Support Card */}
      <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-lg p-5 border border-green-200">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-[#00AEEF] to-[#0079C1] p-2 rounded-full mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-teal-800">Need Help?</h3>
        </div>
        <p className="mt-2 text-teal-700">
          Contact our support team at <span className="font-semibold">support@egret.com</span> or call <span className="font-semibold">0200 770 500</span>
        </p>
      </div>
    </div>

    {/* Footer */}
    <div className="bg-gradient-to-r from-[#00AEEF] to-[#0079C1] px-6 py-4">
      <p className="text-xs text-white text-center">
        © 2025 Egret Systems | Powered by Nepserv Consults Limited | Contact: 0200770500 / 0393236376
      </p>
    </div>
  </div>
);

// Helper component for detail items
const DetailItem: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div>
    <dt className={`text-sm font-medium ${highlight ? 'text-teal-700' : 'text-gray-500'}`}>{label}</dt>
    <dd className={`mt-1 text-sm ${highlight ? 'font-semibold text-teal-700' : 'text-gray-900'}`}>
      {value || <span className="text-gray-400">Not provided</span>}
    </dd>
  </div>
);

export default ThankYouStep;