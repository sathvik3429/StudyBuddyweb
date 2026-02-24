import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import EmailVerificationScreen from './EmailVerificationScreen';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Invalid Link</h2>
          <p className="mt-2 text-gray-600">Please use the link from your registration or login page.</p>
        </div>
      </div>
    );
  }

  return <EmailVerificationScreen email={email} />;
};

export default VerifyEmailPage;
