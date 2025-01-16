const crypto = require('crypto');

// Encrypt a single value
const encryptValue = (value, encryptionKey) => {
  const cipher = crypto.createCipheriv('aes-128-ecb', encryptionKey, null);
  let encrypted = cipher.update(value, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
};

// Decrypt a single value
const decryptValue = (encryptedValue, decryptionKey) => {
  const decipher = crypto.createDecipheriv('aes-128-ecb', decryptionKey, null);
  let decrypted = decipher.update(encryptedValue, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

// Generate encrypted and plain URLs
const generateEncryptedURL = async (params, encryptionKey) => {
  if (!encryptionKey || encryptionKey.length !== 16) {
    throw new Error("Invalid encryption key. Ensure it's 16 bytes long.");
  }

  if (!params.mandatoryFields || !params.returnURL || !params.referenceNo) {
    throw new Error("Required parameters are missing or invalid.");
  }

  const keyBuffer = Buffer.from(encryptionKey, 'utf8');

  const encryptedParams = {};
  for (const [key, value] of Object.entries(params)) {
    encryptedParams[key] = value ? encryptValue(value, keyBuffer) : '';
  }

  const plainURL = `https://eazypay.icicibank.com/EazyPG?merchantid=${params.merchantID}` +
    `&mandatory fields=${params.mandatoryFields}` +
    `&optional fields=${params.optionalFields}` +
    `&returnurl=${params.returnURL}` +
    `&Reference No=${params.referenceNo}` +
    `&submerchantid=${params.subMerchantID}` +
    `&transaction amount=${params.transactionAmount}` +
    `&paymode=${params.payMode}`;

  const encryptedURL = `https://eazypay.icicibank.com/EazyPG?merchantid=${params.merchantID}` +
    `&mandatory fields=${encodeURIComponent(encryptedParams['mandatoryFields'])}` +
    `&optional fields=${encodeURIComponent(encryptedParams['optionalFields'])}` +
    `&returnurl=${encodeURIComponent(encryptedParams['returnURL'])}` +
    `&Reference No=${encodeURIComponent(encryptedParams['referenceNo'])}` +
    `&submerchantid=${encodeURIComponent(encryptedParams['subMerchantID'])}` +
    `&transaction amount=${encodeURIComponent(encryptedParams['transactionAmount'])}` +
    `&paymode=${encodeURIComponent(encryptedParams['payMode'])}`;

  return { plainURL, encryptedURL };
};

// Decrypt URL to retrieve original parameters
const decryptURL = (encryptedURL, decryptionKey) => {
  if (!decryptionKey || decryptionKey.length !== 16) {
    throw new Error("Invalid decryption key. Ensure it's 16 bytes long.");
  }

  const keyBuffer = Buffer.from(decryptionKey, 'utf8');

  // Extract query parameters from the URL
  const urlParams = new URLSearchParams(encryptedURL.split('?')[1]);
  const decryptedParams = {};

  for (const [key, value] of urlParams.entries()) {
    if (key !== 'merchantid') {
      // Decrypt only if there's a value
      decryptedParams[key] = value ? decryptValue(decodeURIComponent(value), keyBuffer) : '';
    } else {
      // Merchant ID remains plain
      decryptedParams[key] = value;
    }
  }

  // Reconstruct the plain URL
  const plainURL = `https://eazypay.icicibank.com/EazyPG?merchantid=${decryptedParams.merchantid}` +
    `&mandatory fields=${decryptedParams['mandatory fields']}` +
    `&optional fields=${decryptedParams['optional fields'] || ''}` +
    `&returnurl=${decryptedParams.returnurl}` +
    `&Reference No=${decryptedParams['Reference No']}` +
    `&submerchantid=${decryptedParams.submerchantid}` +
    `&transaction amount=${decryptedParams['transaction amount']}` +
    `&paymode=${decryptedParams['paymode']}`;

  return plainURL;
};

module.exports = { generateEncryptedURL, decryptURL };
