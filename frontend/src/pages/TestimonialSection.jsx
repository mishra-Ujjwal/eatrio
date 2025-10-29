import React from "react";

const testimonials = [
  {
    rating: 5,
    text: "ScanOrder transformed our food court operations. Orders are now seamless and we've reduced wait times by 60%!",
    name: "Rajesh Sharma",
    role: "Owner, Spice Junction",
    initials: "RS",
  },
  {
    rating: 5,
    text: "The analytics feature helped us understand customer preferences better. Our revenue increased by 40% in just 3 months.",
    name: "Priya Krishnan",
    role: "Manager, South Delights",
    initials: "PK",
  },
  {
    rating: 5,
    text: "Setup was incredibly easy. Within 2 hours, we were accepting digital orders. The support team is fantastic!",
    name: "Arjun Mehta",
    role: "Owner, Punjabi Tadka",
    initials: "AM",
  },
];

const TestimonialCard = ({ testimonial }) => (
  <div style={{
    maxWidth: 350,
    margin: "1rem",
    padding: "2rem",
    borderRadius: 16,
    background: "#fff",
    boxShadow: "0 2px 24px rgba(0,0,0,0.07)",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start"
  }}>
    <div style={{ marginBottom: "1rem" }}>
      {Array(testimonial.rating).fill().map((_, i) => (
        <span key={i} style={{ color: "#f7b500", fontSize: 22 }}>★</span>
      ))}
    </div>
    <p style={{ fontSize: 18, lineHeight: 1.5, marginBottom: 24 }}>{testimonial.text}</p>
    <div style={{ display: "flex", alignItems: "center" }}>
      <span style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: "#ff6d00",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: 20,
        marginRight: 16
      }}>
        {testimonial.initials}
      </span>
      <div>
        <div style={{ fontWeight: 700 }}>{testimonial.name}</div>
        <div style={{ color: "#67727e", fontSize: 15 }}>{testimonial.role}</div>
      </div>
    </div>
  </div>
);

const TestimonialSection = () => (
  <section style={{
    padding: "4rem 1rem",
    background: "#fafbfc",
    textAlign: "center"
  }}>
    <h2 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: 8 }}>Trusted by Food Court Owners</h2>
    <p style={{ fontSize: 22, color: "#4a5568", marginBottom: 48 }}>
      Join hundreds of restaurants already using ScanOrder
    </p>
    <div style={{
      display: "flex",
      justifyContent: "center",
      gap: "2rem",
      flexWrap: "wrap"
    }}>
      {testimonials.map((t, idx) => (
        <TestimonialCard key={idx} testimonial={t} />
      ))}
    </div>
  </section>
);

export default TestimonialSection;
