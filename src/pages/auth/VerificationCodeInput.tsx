import React, { useRef, useState, useEffect } from 'react';
import { Mail, RotateCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface VerificationCodeInputProps {
  onComplete: (code: string) => void;
  disabled?: boolean;
  error?: boolean;
  onResend?: () => Promise<void>;
  email?: string;
}

const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  onComplete,
  disabled = false,
  error = false,
  onResend,
  email,
}) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const hasSubmitted = useRef(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value) || value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length) {
      const newCode = [...code];
      for (let i = 0; i < 6; i++) {
        newCode[i] = pasted[i] || '';
      }
      setCode(newCode);
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const resetCode = () => {
    setCode(Array(6).fill(''));
    hasSubmitted.current = false;
    inputRefs.current[0]?.focus();
  };

  const handleResendClick = async () => {
    if (!onResend) return;
    setIsResending(true);
    try {
      await onResend();
      toast.success('Verification code resent successfully!');
      resetCode();
    } catch (err) {
      toast.error('Failed to resend verification code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    const completeCode = code.join('');
    if (completeCode.length === 6 && !hasSubmitted.current) {
      hasSubmitted.current = true;
      onComplete(completeCode);
    }
  }, [code, onComplete]);

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <Mail className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">Verify your email</h3>
        {email && (
          <p className="mt-2 text-sm text-gray-600">
            Enter the verification code sent to <span className="font-medium">{email}</span>
          </p>
        )}
      </div>

      <div className="flex justify-center space-x-3 mb-6">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={`w-12 h-14 text-center text-2xl font-semibold border rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
              ${error ? 'border-red-500 shake-animation' : 'border-gray-300'}
              ${disabled ? 'opacity-70 cursor-not-allowed bg-gray-100' : 'bg-white'}
              transition-all duration-200 shadow-sm`}
          />
        ))}
      </div>

      {error && (
        <div className="text-center text-sm text-red-600 mb-4">
          The verification code you entered is invalid. Please try again.
        </div>
      )}

      {onResend && (
        <div className="text-center mt-4">
          <button
            onClick={handleResendClick}
            disabled={isResending || disabled}
            className="text-sm font-medium text-green-600 hover:text-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? (
              <span className="flex items-center justify-center">
                <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                Resending...
              </span>
            ) : (
              "Didn't receive a code? Resend"
            )}
          </button>
        </div>
      )}

      <style >{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        .shake-animation {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default VerificationCodeInput;
