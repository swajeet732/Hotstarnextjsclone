// pages/signup.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactFlagsSelect from 'react-flags-select';
import './styles.css'; // Ensure this is correctly imported

const Signup: React.FC = () => {
  const [phone, setPhone] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('IN'); // Default country code
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [otpGenerated, setOtpGenerated] = useState<boolean>(false);
  const router = useRouter();

  const countryCodes: { [key: string]: string } = {
    US: '+1',
    IN: '+91',
    GB: '+44',
    FR: '+33',
    DE: '+49',
    ES: '+34',
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const fullPhoneNumber = `${countryCodes[countryCode]}${phone}`;
    if (phone.length === 10 && /^[0-9]+$/.test(phone)) {
      const generatedOtp = generateOtp();
      console.log('Generated OTP:', generatedOtp);
      setOtp(generatedOtp.split(''));
      setOtpGenerated(true);
      setTimeout(() => {
        router.push('/home');
      }, 5000);
    } else {
      alert('Phone number must be 10 digits and contain only numbers');
    }
  };

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Filter non-numeric characters
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-black">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl text-white mb-6 text-center">Login</h1>
        {!otpGenerated ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2" htmlFor="phone">
                Phone Number
              </label>
              <div className="flex space-x-2">
                <ReactFlagsSelect
                  selected={countryCode}
                  onSelect={(code) => setCountryCode(code)}
                  countries={["US", "IN", "GB", "FR", "DE", "ES"]}
                  customLabels={{ US: '+1', IN: '+91', GB: '+44', FR: '+33', DE: '+49', ES: '+34' }}
                  placeholder="Select Country"
                  className="react-flags-select bg-gray-700 text-white"
                />
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="Enter your phone number"
                  maxLength={10}
                  className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>
        ) : (
          <div>
            <h2 className="text-xl text-white mb-4 text-center">Enter OTP</h2>
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  className="w-12 p-3 rounded bg-gray-700 text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>
            <p className="text-white mt-4 text-center">Redirecting in 5 seconds...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
