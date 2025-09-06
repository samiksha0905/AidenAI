import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { apiService } from '../utils/api';

const ServicePage = () => {
  const { serviceUrl } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (serviceUrl) {
      fetchService();
    }
  }, [serviceUrl]); // eslint-disable-line react-hooks/exhaustive-deps

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
              <form>
                <div className="form-row">
                  <input type="text" placeholder="Your Name" required />
                  <input type="email" placeholder="Your Email" required />
                </div>
                <input type="tel" placeholder="Phone Number" />
                <textarea 
                  placeholder="Describe your project or needs..."
                  rows={4}
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
    </div>
  );
};

export default ServicePage;
