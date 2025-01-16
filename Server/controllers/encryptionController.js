const { generateEncryptedURL, decryptURL } = require("../services/encryptionService");
const generateReferenceNumber = (minLength = 1, maxLength = 30) => {
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  let referenceNumber = '';
  for (let i = 0; i < length; i++) {
    referenceNumber += Math.floor(Math.random() * 10); // Add a random digit (0-9)
  }
  return referenceNumber;
};
exports.createEncryptedURL = async (req, res) => {
  const encryptionKey = process.env.ICICI_ENCRYPTION_KEY;
  if (!encryptionKey) {
    return res.status(500).json({ error: "Encryption key is undefined." });
  }

  const {
    merchantID,
    mandatoryFields,
    optionalFields,
    returnURL,
    referenceNo,
    subMerchantID,
    transactionAmount,
    payMode,
  } = req.body;

  if (
    !merchantID || 
    !mandatoryFields || 
    !returnURL || 
    !referenceNo || 
    !subMerchantID || 
    !transactionAmount || 
    !payMode
  ) {
    return res.status(400).json({ error: "Missing required fields in the request body." });
  }

  try {
    const { encryptedURL, plainURL } = await generateEncryptedURL(
      {
        merchantID,
        mandatoryFields,
        optionalFields: optionalFields,
        returnURL: "https://khit.campusify.io/dashboard/return-url",
        referenceNo,
        subMerchantID,
        transactionAmount,
        payMode,
      },
      encryptionKey
    );

    res.status(200).json({ encryptedURL, plainURL });
  } catch (error) {
    console.error("Error generating encrypted URL:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.decryptEncryptedURL = async (req, res) => {
  const encryptionKey = process.env.ICICI_ENCRYPTION_KEY;
  if (!encryptionKey) {
    return res.status(500).json({ error: "Decryption key is undefined." });
  }

  const { encryptedURL } = req.body;

  if (!encryptedURL) {
    return res.status(400).json({ error: "Missing encrypted URL in the request body." });
  }

  try {
    const decryptedURL = decryptURL(encryptedURL, encryptionKey);
    res.status(200).json({ decryptedURL });
  } catch (error) {
    console.error("Error decrypting URL:", error);
    res.status(500).json({ error: error.message });
  }
};
