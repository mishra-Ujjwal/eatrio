import React from "react";

const Footer = () => (
  <footer className="bg-green-950" style={{
    
    color: "#ececec",
    padding: "3rem 2rem 2rem 2rem",
    fontSize: "1.1rem"
  }}>
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      maxWidth: 1200,
      margin: "0 auto",
      alignItems: "flex-start",
      justifyContent: "space-between"
    }}>
      <div style={{ flex: "1 1 260px", marginBottom: 32 }}>
        <div className="flex items-center gap-2" style={{ fontWeight: 700, fontSize: 28, marginBottom: 12 }}>
         Eatrio
        </div>
        <div style={{ color: "#bdbdbd", fontSize: 18, marginBottom: 16, maxWidth: 350 }}>
          Revolutionizing food court operations with smart digital ordering solutions.
        </div>
       
      </div>
      <div style={{ flex: "1 1 160px", marginBottom: 32 }}>
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 14 }}>Product</div>
        <div>Features</div>
        <div>Pricing</div>
        <div>Demo</div>
        <div>API</div>
      </div>
      <div style={{ flex: "1 1 210px", marginBottom: 32 }}>
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 14 }}>Support</div>
        <div>Help Center</div>
        <div>Documentation</div>
        <div>Contact Us</div>
        <div>System Status</div>
      </div>
      <div style={{ flex: "1 1 220px", marginBottom: 32 }}>
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 14 }}>Contact Info</div>
        <div><span role="img" aria-label="email">📧</span> support@eatrio.com</div>
        <div><span role="img" aria-label="phone">📞</span> +91 770188 3014</div>
        <div><span role="img" aria-label="location">📍</span> Delhi, India</div>
        <div><span role="img" aria-label="support">🌐</span> 24/7 Support</div>
      </div>
    </div>
    <hr style={{ border: "none", borderTop: "1px solid #232A36", margin: "2.5rem 0 1rem 0" }}/>
    <div style={{ textAlign: "center", color: "#bdbdbd", fontSize: 16 }}>
      © 2025 Eatrio. All rights reserved. | Powered by Eatrio
    </div>
  </footer>
);

export default Footer;
