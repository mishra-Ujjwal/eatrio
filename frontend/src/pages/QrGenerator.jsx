import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const QrStyled = () => {
  const qrValue = "https://eatrio.onrender.com/login";

  return (
    <div className="relative inline-block">
      <QRCodeCanvas
        value={qrValue}
        size={200}
        bgColor="#ffffff"
        fgColor="#0D6E4F"   
        level="H"
        includeMargin={true}
      />

      <img
        src="/logo1.png"
        alt="logo"
        className="absolute top-1/2 left-1/2 w-12 h-12 transform -translate-x-1/2 -translate-y-1/2  border-2 border-white"
      />
    </div>
  );
};

export default QrStyled;
