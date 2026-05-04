import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import * as testService from '../../services/testService';

import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);
        if (user) {
          const data = await testService.test();
          setMessage(data.message);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    if (user) fetchTest();
    else setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Welcome, {user ? user.username : 'Guest'}
        </h1>
        
        <div className={styles.roleContainer}>
          <div className={`${styles.roleBadge} ${
            user ? (user.is_admin ? styles.adminBadge : styles.userBadge) : styles.guestBadge
          }`}>
            {user ? (user.is_admin ? '👑 Administrator' : '👤 Customer') : '👋 Visitor'}
          </div>
        </div>
      </div>

      <div className={styles.welcomeCard}>
        <div className={styles.welcomeContent}>
          <h2 className={styles.welcomeTitle}>
            Welcome to Our Store & Services
          </h2>
          
          <p className={styles.welcomeText}>
            {user ? (
              user.is_admin ? (
                "Manage products, services, and oversee all customer activities from your administrative dashboard."
              ) : (
                "Browse our collection of quality products or book professional services tailored to your needs."
              )
            ) : (
              "Discover amazing products and professional services. Create an account to start shopping and booking."
            )}
          </p>
          
          {message && (
            <div className={styles.messageCard}>
              <div className={styles.messageIcon}>💬</div>
              <div className={styles.messageText}>{message}</div>
            </div>
          )}
        </div>
        
        <div className={styles.welcomeImage}>
          <div className={styles.imagePlaceholder}>
            {user ? '📊' : '🛒'}
          </div>
        </div>
      </div>

      <div className={styles.infoSection}>
        <h3 className={styles.sectionTitle}>
          {user ? 'Your Dashboard' : 'Platform Overview'}
        </h3>
        
        <div className={styles.infoGrid}>
          {user ? (
            user.is_admin ? (
              // Admin info cards
              <>
                <div className={styles.infoCard}>
                  <div className={styles.cardIcon}>📦</div>
                  <h4>Order Management</h4>
                  <p>Review and process customer orders, update order status, and manage inventory.</p>
                </div>
                
                <div className={styles.infoCard}>
                  <div className={styles.cardIcon}>📅</div>
                  <h4>Booking Oversight</h4>
                  <p>Approve or decline service bookings and manage the service calendar.</p>
                </div>
                
                <div className={styles.infoCard}>
                  <div className={styles.cardIcon}>➕</div>
                  <h4>Content Management</h4>
                  <p>Add new products and services, update pricing, and manage availability.</p>
                </div>
              </>
            ) : (
              // Customer info cards
              <>
                <div className={styles.infoCard}>
                  <div className={styles.cardIcon}>🛒</div>
                  <h4>Shop Products</h4>
                  <p>Browse our collection and add items to your cart for purchase.</p>
                </div>
                
                <div className={styles.infoCard}>
                  <div className={styles.cardIcon}>🔧</div>
                  <h4>Book Services</h4>
                  <p>Schedule professional services at your convenience.</p>
                </div>
                
                <div className={styles.infoCard}>
                  <div className={styles.cardIcon}>📋</div>
                  <h4>Track Orders</h4>
                  <p>Monitor your purchases and service bookings in one place.</p>
                </div>
              </>
            )
          ) : (
            // Guest info cards
            <>
              <div className={styles.infoCard}>
                <div className={styles.cardIcon}>🛍️</div>
                <h4>Product Shopping</h4>
                <p>Browse and purchase from our diverse product catalog.</p>
              </div>
              
              <div className={styles.infoCard}>
                <div className={styles.cardIcon}>⚙️</div>
                <h4>Service Booking</h4>
                <p>Schedule professional services that match your needs.</p>
              </div>
              
              <div className={styles.infoCard}>
                <div className={styles.cardIcon}>⭐</div>
                <h4>Customer Experience</h4>
                <p>Read reviews and share your experiences with our products.</p>
              </div>
            </>
          )}
        </div>
      </div>

      {!user && (
        <div className={styles.ctaSection}>
          <h3 className={styles.sectionTitle}>Ready to Get Started?</h3>
          <p className={styles.ctaText}>
            Join our community of satisfied customers. Sign up today to unlock all features.
          </p>
          <div className={styles.ctaButtons}>
            <a href="/sign-in" className={styles.primaryButton}>Sign In</a>
            <a href="/sign-up" className={styles.secondaryButton}>Create Account</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;