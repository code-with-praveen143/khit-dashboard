import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { transactionId } = req.body; // Extract the transaction ID from the request body

    if (!transactionId) {
      return res.status(400).json({ error: 'Transaction ID is required' });
    }

    try {
      // Send the request to ICICI's checkUPIstatus endpoint
      const response = await fetch('https://eazypay.icicibank.com/checkUPIstatus.action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `transactionId=${transactionId}`, // Replace with the correct payload as per ICICI's API documentation
      });

      const result = await response.text(); // Assuming the response is in text or JSON format
      res.status(200).json({ status: result });
    } catch (error) {
      console.error('Error checking payment status:', error);
      res.status(500).json({ error: 'Failed to verify payment status' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}
