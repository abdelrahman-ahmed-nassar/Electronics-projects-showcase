"use client";
import React, { useState } from "react";
import Link from "next/link";

const Contact = () => {
  return (
    <>
      <CircuitBackground />
      <ContactHero />
      <ContactFormSection />
      <ContactInfoSection />
      <MapSection />
      <FaqSection />
    </>
  );
};

// Circuit Board Background Pattern Component
const CircuitBackground = () => {
  return (
    <div
      className="absolute inset-0 opacity-10 z-10"
      style={{
        backgroundImage:
          "radial-gradient(#4d94ff 1px, transparent 1px), linear-gradient(to right, #4d94ff 1px, transparent 1px), linear-gradient(to bottom, #4d94ff 1px, transparent 1px)",
        backgroundSize: "20px 20px, 40px 40px, 40px 40px",
        backgroundPosition: "0 0, 0 0, 0 0",
        backgroundBlendMode: "soft-light",
        pointerEvents: "none", // Ensures the background doesn't interfere with clicks
      }}
    ></div>
  );
};



// Contact Hero Section Component
const ContactHero = () => {
  return (
    <section className="flex flex-col justify-center items-center text-center relative overflow-hidden p-5 pt-20 pb-32">
      <div className="absolute inset-0 opacity-10 -z-10" style={{
        backgroundImage:
          "radial-gradient(#4d94ff 1px, transparent 1px), linear-gradient(to right, #4d94ff 1px, transparent 1px), linear-gradient(to bottom, #4d94ff 1px, transparent 1px)",
        backgroundSize: "20px 20px, 40px 40px, 40px 40px",
        backgroundPosition: "0 0, 0 0, 0 0",
        backgroundBlendMode: "soft-light",
        pointerEvents: "none",
      }}></div>
      <h1 className="text-4xl md:text-5xl mb-5 text-white z-10">Get in <span className="text-mint-green">Touch</span></h1>
      <p className="text-lg md:text-xl max-w-3xl mb-8 z-10 text-white/80">
        Have questions about our programs, student projects, or facilities? We're here to help you connect with the right people.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <a
          href="#contact-form"
          className="py-3 px-6 bg-mint-green text-navy border-none rounded font-bold cursor-pointer no-underline transition-all hover:bg-electric-blue hover:text-white hover:-translate-y-0.5 hover:shadow-lg z-10"
        >
          Send Message
        </a>
        <a
          href="#contact-info"
          className="py-3 px-6 bg-transparent text-electric-blue border border-electric-blue rounded font-bold cursor-pointer no-underline transition-all hover:bg-electric-blue/10 hover:-translate-y-0.5 hover:shadow-lg z-10"
        >
          View Contact Info
        </a>
      </div>
    </section>
  );
};

// Contact Form Section
const ContactFormSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "general"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    alert("Form submitted! (This is just a demo - no actual form submission)");
  };

  return (
    <section className="py-16 px-5 bg-white/[0.02]" id="contact-form">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl text-center mb-10 text-mint-green">Send Us a Message</h2>
        
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 lg:order-2">
            <div className="bg-white/5 rounded-lg p-6 border border-electric-blue/20">
              <h3 className="text-white text-xl mb-4">Why Contact Us?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="text-mint-green text-lg mt-1">✓</div>
                  <div>
                    <h4 className="text-electric-blue font-medium mb-1">Project Inquiries</h4>
                    <p className="text-white/80 text-sm">Questions about student projects or interested in collaboration opportunities.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="text-mint-green text-lg mt-1">✓</div>
                  <div>
                    <h4 className="text-electric-blue font-medium mb-1">Campus Tours</h4>
                    <p className="text-white/80 text-sm">Schedule a visit to our facilities and laboratories.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="text-mint-green text-lg mt-1">✓</div>
                  <div>
                    <h4 className="text-electric-blue font-medium mb-1">Admissions</h4>
                    <p className="text-white/80 text-sm">Information about application process and program requirements.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="text-mint-green text-lg mt-1">✓</div>
                  <div>
                    <h4 className="text-electric-blue font-medium mb-1">Industry Partnerships</h4>
                    <p className="text-white/80 text-sm">Explore opportunities for research collaboration or student internships.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex-1 lg:order-1">
            <form onSubmit={handleSubmit} className="bg-white/5 rounded-lg p-6 border border-electric-blue/20">
              <div className="mb-4">
                <label htmlFor="name" className="block text-white mb-2">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 bg-navy border border-electric-blue/30 rounded text-white focus:border-mint-green focus:outline-none transition-all"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-white mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 bg-navy border border-electric-blue/30 rounded text-white focus:border-mint-green focus:outline-none transition-all"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="type" className="block text-white mb-2">Inquiry Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-3 bg-navy border border-electric-blue/30 rounded text-white focus:border-mint-green focus:outline-none transition-all"
                >
                  <option value="general">General Inquiry</option>
                  <option value="project">Project Information</option>
                  <option value="admission">Admissions</option>
                  <option value="tour">Campus Tour</option>
                  <option value="partnership">Industry Partnership</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="subject" className="block text-white mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-3 bg-navy border border-electric-blue/30 rounded text-white focus:border-mint-green focus:outline-none transition-all"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-white mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full p-3 bg-navy border border-electric-blue/30 rounded text-white focus:border-mint-green focus:outline-none transition-all"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="py-3 px-6 bg-mint-green text-navy border-none rounded font-bold cursor-pointer transition-all hover:bg-electric-blue hover:text-white hover:-translate-y-0.5 hover:shadow-lg w-full"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// Contact Info Section
const ContactInfoSection = () => {
  const contactDetails = [
    {
      title: "Main Office",
      address: "Al Azhar University Campus, Building C",
      city: "Cairo, Egypt",
      phone: "+20 2 2345 6789",
      email: "info@alazhar-eng.edu",
      hours: "Sun-Thu: 8:00 AM - 4:00 PM",
      icon: "🏢"
    },
    {
      title: "Admissions Office",
      address: "Al Azhar University Campus, Building A",
      city: "Cairo, Egypt",
      phone: "+20 2 2345 8901",
      email: "admissions@alazhar-eng.edu",
      hours: "Sun-Thu: 9:00 AM - 3:00 PM",
      icon: "🎓"
    },
    {
      title: "Research & Partnerships",
      address: "Innovation Center, Floor 3",
      city: "Cairo, Egypt",
      phone: "+20 2 2345 6790",
      email: "research@alazhar-eng.edu",
      hours: "By appointment only",
      icon: "🔬"
    }
  ];

  return (
    <section className="py-16 px-5" id="contact-info">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl text-center mb-10 text-mint-green">Contact Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contactDetails.map((contact, index) => (
            <div 
              key={index} 
              className="bg-white/5 rounded-lg p-6 border border-electric-blue/20 hover:border-electric-blue transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="text-4xl mb-4">{contact.icon}</div>
              <h3 className="text-xl text-white mb-4">{contact.title}</h3>
              
              <div className="space-y-3 text-white/80">
                <p className="flex items-start gap-2">
                  <span className="text-mint-green">📍</span>
                  <span>{contact.address}<br/>{contact.city}</span>
                </p>
                
                <p className="flex items-start gap-2">
                  <span className="text-mint-green">📞</span>
                  <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="hover:text-mint-green transition-colors">{contact.phone}</a>
                </p>
                
                <p className="flex items-start gap-2">
                  <span className="text-mint-green">✉️</span>
                  <a href={`mailto:${contact.email}`} className="hover:text-mint-green transition-colors">{contact.email}</a>
                </p>
                
                <p className="flex items-start gap-2">
                  <span className="text-mint-green">🕒</span>
                  <span>{contact.hours}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 flex justify-center">
          <div className="inline-flex gap-4 border border-electric-blue/30 rounded-lg p-4 bg-white/5">
            <a href="#" className="text-2xl text-white/80 hover:text-mint-green transition-colors">
              <span role="img" aria-label="facebook">📱</span>
            </a>
            <a href="#" className="text-2xl text-white/80 hover:text-mint-green transition-colors">
              <span role="img" aria-label="twitter">🐦</span>
            </a>
            <a href="#" className="text-2xl text-white/80 hover:text-mint-green transition-colors">
              <span role="img" aria-label="instagram">📸</span>
            </a>
            <a href="#" className="text-2xl text-white/80 hover:text-mint-green transition-colors">
              <span role="img" aria-label="linkedin">💼</span>
            </a>
            <a href="#" className="text-2xl text-white/80 hover:text-mint-green transition-colors">
              <span role="img" aria-label="youtube">🎥</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// Map Section
const MapSection = () => {
  return (
    <section className="py-16 px-5 bg-white/[0.02]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl text-center mb-10 text-mint-green">Find Us</h2>
        
        <div className="bg-white/5 rounded-lg p-2 border border-electric-blue/20 overflow-hidden">
          {/* This would be replaced with an actual map component. 
              Using a placeholder image for demonstration */}
          <div className="w-full h-96 bg-navy relative">
            <img 
              src="/api/placeholder/1200/400" 
              alt="Map location of Al Azhar Computer Engineering College" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-navy/80 p-4 rounded-lg text-center">
                <p className="text-mint-green font-bold">Map Placeholder</p>
                <p className="text-white/80 text-sm">Al Azhar University Campus, Cairo, Egypt</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white/5 rounded-lg p-6 border border-electric-blue/20">
          <h3 className="text-xl text-white mb-4">Transportation & Directions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-electric-blue font-medium mb-2">By Public Transport</h4>
              <ul className="space-y-2 text-white/80">
                <li>Metro: Line 3 to Al Azhar Station, then 10 minute walk</li>
                <li>Bus: Routes 112, 450, 621 stop directly at the campus entrance</li>
                <li>Microbuses available from Ramses and Tahrir Squares</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-electric-blue font-medium mb-2">By Car</h4>
              <ul className="space-y-2 text-white/80">
                <li>From Downtown: 25 minutes via Salah Salem Road</li>
                <li>From Giza: 40 minutes via 6th October Bridge</li>
                <li>Visitor parking available at the south entrance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// FAQ Section for Contact Page
const FaqSection = () => {
  const faqs = [
    {
      question: "What are the best hours to visit the campus?",
      answer: "The campus is open Sunday through Thursday from 8:00 AM to 4:00 PM. For the best experience, we recommend visiting between 10:00 AM and 2:00 PM when most labs are active and faculty members are available."
    },
    {
      question: "Do I need to schedule an appointment for a campus tour?",
      answer: "Yes, we recommend scheduling campus tours at least 3 days in advance using our contact form. This ensures we can provide you with a guided tour that focuses on your areas of interest."
    },
    {
      question: "How quickly can I expect a response to my inquiry?",
      answer: "We aim to respond to all inquiries within 1-2 business days. For urgent matters, we recommend calling our main office directly."
    },
    {
      question: "Can I meet with specific faculty members during my visit?",
      answer: "Yes, meetings with faculty members can be arranged with advance notice. Please specify which department or faculty member you'd like to meet in your tour request."
    }
  ];

  return (
    <section className="py-16 px-5">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl text-center mb-10 text-mint-green">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-6 border border-electric-blue/20">
              <h3 className="text-xl text-white mb-3">{faq.question}</h3>
              <p className="text-white/80">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Footer Component

export default Contact;