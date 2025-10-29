import axios from "axios";

// Your Fast2SMS API Key (Get from https://www.fast2sms.com/dev)
const API_KEY = process.env.API_KEY;

export const sendSMS = async (phoneNumber, message) => {
  try {
    const response = await axios({
      method: "POST",
      url: "https://www.fast2sms.com/dev/bulkV2",
      headers: {
        "authorization": API_KEY,
        "Content-Type": "application/json"
      },
      data: {
        route: "v3",
        sender_id: "FSTSMS",
        message: message,
        language: "english",
        flash: 0,
        numbers: phoneNumber
      }
    });

    console.log("SMS Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("SMS Sending Error:", error.response?.data || error.message);
  }
};

// Example usage
// sendSMS("91XXXXXXXXXX", "Your order has been received! Thank you for ordering at ScanEats.");
