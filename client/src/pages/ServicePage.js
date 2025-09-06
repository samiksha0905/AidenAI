import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Star, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { apiService } from '../utils/api';

const ServicePage = () => {
  const { serviceUrl } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: ''
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Only clear form data when explicitly requested via clearForm event
  // Remove automatic clearing on navigation to allow form data to persist

  useEffect(() => {
    if (serviceUrl) {
      fetchService();
    }
  }, [serviceUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for form fill and clear events from chatbot
  useEffect(() => {
    const handleFormFill = (event) => {
      const data = event.detail;
      console.log('📝 Received form data:', data);
      
      // Update form fields
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        description: data.description || ''
      });
      
      // Scroll to contact form after a short delay
      setTimeout(() => {
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
          contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Highlight the form briefly
          contactForm.style.boxShadow = '0 0 20px var(--primary)';
          setTimeout(() => {
            contactForm.style.boxShadow = 'var(--shadow-lg)';
          }, 2000);
        }
      }, 1000);
    };

    const handleFormClear = (event) => {
      console.log('🧹 ServicePage: Clearing form data due to navigation');
      setFormData({
        name: '',
        email: '',
        phone: '',
        description: ''
      });
    };

    window.addEventListener('fillForm', handleFormFill);
    window.addEventListener('clearForm', handleFormClear);
    return () => {
      window.removeEventListener('fillForm', handleFormFill);
      window.removeEventListener('clearForm', handleFormClear);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('📨 Form submitted:', formData);
    
    // Show success popup
    setShowSuccessPopup(true);
    
    // Navigate to home after 3 seconds
    setTimeout(() => {
      setShowSuccessPopup(false);
      navigate('/');
    }, 3000);
  };

  const fetchService = async () => {
    try {
      const response = await apiService.getService(serviceUrl);
      setService(response.data);
    } catch (error) {
      console.error('Error fetching service:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="service-page">
        <div className="container">
          <div className="loading-skeleton">
            <div className="skeleton-header"></div>
            <div className="skeleton-content"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="service-page">
        <div className="container">
          <div className="error-state">
            <h1>Service not found</h1>
            <p>The service you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="service-page">
      <section className="service-hero" style={{ '--service-color': service.color }}>
        <div className="container">
          <div className="service-hero-content">
            <div className="service-hero-icon">
              <span className="service-emoji">{service.icon}</span>
            </div>
            <div className="service-hero-info">
              <h1 className="service-title">{service.name}</h1>
              <p className="service-description">{service.description}</p>
              <div className="service-rating">
                <div className="rating">
                  <Star size={20} fill="currentColor" />
                  <span className="rating-value">{service.rating}</span>
                  <span className="rating-count">({service.reviews} reviews)</span>
                </div>
                <button className="contact-button">
                  <Phone size={18} />
                  Contact Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="service-sections">
        <div className="container">
          <div className="sections-grid">
            {service.subSections?.map((section, index) => (
              <div 
                key={section._id}
                id={section.sectionId.replace('#', '')}
                className="section-card slide-up"
                style={{ '--delay': `${index * 0.1}s` }}
              >
                <h2>{section.name}</h2>
                <p>{section.description}</p>
                <div className="section-features">
                  <h3>What's Included:</h3>
                  <ul>
                    <li>Professional consultation</li>
                    <li>Quality materials and tools</li>
                    <li>Expert installation/service</li>
                    <li>Warranty and support</li>
                  </ul>
                </div>
                <button className="section-cta">
                  Get Quote
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h2>Get In Touch</h2>
              <p>Ready to get started? Contact us today for a free consultation and quote.</p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <Phone size={20} />
                  <div>
                    <strong>Phone</strong>
                    <p>(555) 123-4567</p>
                  </div>
                </div>
                <div className="contact-item">
                  <Mail size={20} />
                  <div>
                    <strong>Email</strong>
                    <p>info@servicehub.com</p>
                  </div>
                </div>
                <div className="contact-item">
                  <MapPin size={20} />
                  <div>
                    <strong>Service Area</strong>
                    <p>Greater Metro Area</p>
                  </div>
                </div>
                <div className="contact-item">
                  <Clock size={20} />
                  <div>
                    <strong>Hours</strong>
                    <p>Mon-Fri: 8AM-6PM<br />Sat: 9AM-4PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="contact-form">
              <form onSubmit={handleFormSubmit}>
                <div className="form-row">
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Your Name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                  />
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Your Email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="Phone Number" 
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <textarea 
                  name="description"
                  placeholder="Describe your project or needs..."
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
                <button type="submit" className="submit-button">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <div className="success-icon">✓</div>
            <h3>Form Submitted Successfully!</h3>
            <p>Thank you for your inquiry. We'll get back to you soon!</p>
            <div className="success-spinner"></div>
            <p className="redirect-text">Redirecting to home page...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePage;
