import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ArrowRight, Users, Award, Clock } from 'lucide-react';
import { apiService } from '../utils/api';

const Home = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  // Listen for form fill events on home page (just log, don't navigate)
  useEffect(() => {
    const handleFormFill = (event) => {
      const data = event.detail;
      console.log('📝 Home page received form data (staying on home):', data);
      // Note: Home page doesn't have a contact form, so we just log the data
      // Form data will be injected when user navigates to a service page
    };

    window.addEventListener('fillForm', handleFormFill);
    return () => window.removeEventListener('fillForm', handleFormFill);
  }, []);

  const fetchServices = async () => {
    try {
      const response = await apiService.getServices();
      setServices(response.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const featuredServices = services.filter(service => service.featured).slice(0, 3);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title fade-in">
              Your Trusted <span style={{color: 'var(--secondary)'}}>Service Hub</span>
            </h1>
            <p className="hero-subtitle slide-up">
              Connect with professional service providers in your area. From home repairs to tutoring, 
              we've got you covered with quality services you can trust.
            </p>
            <div className="hero-actions slide-up">
              <Link to="/plumbing" className="cta-button primary">
                Explore Services
                <ArrowRight size={20} />
              </Link>
              <div className="hero-stats">
                <div className="stat">
                  <Users size={24} />
                  <div>
                    <div className="stat-number">500+</div>
                    <div className="stat-label">Happy Customers</div>
                  </div>
                </div>
                <div className="stat">
                  <Award size={24} />
                  <div>
                    <div className="stat-number">6+</div>
                    <div className="stat-label">Service Categories</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-services">
        <div className="container">
          <div className="section-header">
            <h2>Featured Services</h2>
            <p>Most popular and highly rated services</p>
          </div>
          
          {loading ? (
            <div className="loading-grid">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="service-card-skeleton"></div>
              ))}
            </div>
          ) : (
            <div className="services-grid">
              {featuredServices.map((service, index) => (
                <Link
                  key={service._id}
                  to={service.pageUrl}
                  className="service-card hover-lift"
                  style={{ '--delay': `${index * 0.1}s` }}
                >
                  <div className="service-icon" style={{ backgroundColor: service.color }}>
                    {service.icon}
                  </div>
                  <div className="service-content">
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                    <div className="service-meta">
                      <div className="rating">
                        <Star size={16} fill="currentColor" />
                        <span>{service.rating}</span>
                        <span className="reviews">({service.reviews} reviews)</span>
                      </div>
                      <ArrowRight size={16} className="service-arrow" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="all-services">
        <div className="container">
          <div className="section-header">
            <h2>All Services</h2>
            <p>Browse our complete range of professional services</p>
          </div>
          
          <div className="services-grid">
            {services.map((service, index) => (
              <Link
                key={service._id}
                to={service.pageUrl}
                className="service-card-compact hover-scale"
                style={{ '--delay': `${index * 0.05}s` }}
              >
                <div className="service-icon-small" style={{ backgroundColor: service.color }}>
                  {service.icon}
                </div>
                <div className="service-info">
                  <h4>{service.name}</h4>
                  <div className="rating-small">
                    <Star size={14} fill="currentColor" />
                    <span>{service.rating}</span>
                  </div>
                </div>
                <ArrowRight size={16} className="service-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Clock size={32} />
              </div>
              <h3>24/7 Support</h3>
              <p>Get help whenever you need it with our round-the-clock support</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Award size={32} />
              </div>
              <h3>Verified Professionals</h3>
              <p>All our service providers are vetted and verified for quality</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Users size={32} />
              </div>
              <h3>Trusted Community</h3>
              <p>Join thousands of satisfied customers in our growing community</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
