import React from "react";

const Footer = () => (
  <footer style={{
    background: "#171E29",
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
        <div style={{ fontWeight: 700, fontSize: 28, marginBottom: 12 }}>
          <span role="img" aria-label="plate">🍽️</span> ScanOrder
        </div>
        <div style={{ color: "#bdbdbd", fontSize: 18, marginBottom: 16, maxWidth: 350 }}>
          Revolutionizing food court operations with smart digital ordering solutions.
        </div>
        <div>
          <span role="img" aria-label="card" style={{ marginRight: 8 }}>💳</span>
          <span role="img" aria-label="phone" style={{ marginRight: 8 }}>📱</span>
          <span role="img" aria-label="globe">🌐</span>
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
        <div><span role="img" aria-label="email">📧</span> support@scanorder.com</div>
        <div><span role="img" aria-label="phone">📞</span> +91 98765 43210</div>
        <div><span role="img" aria-label="location">📍</span> Bangalore, India</div>
        <div><span role="img" aria-label="support">🌐</span> 24/7 Support</div>
      </div>
    </div>
    <hr style={{ border: "none", borderTop: "1px solid #232A36", margin: "2.5rem 0 1rem 0" }}/>
    <div style={{ textAlign: "center", color: "#bdbdbd", fontSize: 16 }}>
      © 2024 ScanOrder. All rights reserved. | Powered by ScanOrder
    </div>
  </footer>
);

export default Footer;
