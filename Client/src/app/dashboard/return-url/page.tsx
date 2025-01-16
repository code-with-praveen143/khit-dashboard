'use client'
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const ReturnURL = () => {
  const searchParams = useSearchParams(); // Access query parameters
  const [paymentData, setPaymentData] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  useEffect(() => {
    const dataParam = searchParams.get('data'); // Get the "data" query parameter
    if (dataParam) {
      try {
        const data = JSON.parse(dataParam);
        setPaymentData(data);

        // Check payment status if transaction ID is available
        if (data.transactionId) {
          checkPaymentStatus(data.transactionId);
        }
      } catch (err) {
        console.error('Error parsing payment data:', err);
      }
    }
  }, [searchParams]);

  const checkPaymentStatus = async (transactionId: string) => {
    try {
      const response = await fetch('/api/check-payment-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactionId }), // Send transaction ID to the API route
      });

      const result = await response.json();
      setPaymentStatus(result.status || 'Unknown');
    } catch (error) {
      console.error('Error checking payment status:', error);
      setPaymentStatus('Failed to verify payment status');
    }
  };

  if (!paymentData) {
    return <h1>Loading payment details...</h1>;
  }

  return (
    <div>
      <h1>Payment Response</h1>
      <pre>{JSON.stringify(paymentData, null, 2)}</pre>

      <h2>Payment Status</h2>
      <p>{paymentStatus || 'Checking status...'}</p>
    </div>
  );
};

export default ReturnURL;
