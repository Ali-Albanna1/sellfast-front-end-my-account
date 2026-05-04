import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import * as testService from '../../services/testService';
import * as bookingService from '../../services/bookingService';
import * as serviceService from '../../services/serviceService';
import styles from './UserDashboard.module.css';

const UserDashboard = () => {
  const { user } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [userBookings, setUserBookings] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [userStats, setUserStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    upcomingBookings: 0
  });

  useEffect(() => {
    const fetchUserDashboardData = async () => {
      try {
        // Fetch test message
        const testData = await testService.test();
        setMessage(testData.message);

        // Fetch user bookings
        const bookings = await bookingService.showUserBookings();
        setUserBookings(bookings.slice(0, 3)); // Show only 3 recent bookings

        // Fetch available services
        const services = await serviceService.getAllAvailable();
        setAvailableServices(services.slice(0, 4)); // Show 4 services

        // Calculate stats
        const totalBookings = bookings.length;
        const pendingBookings = bookings.filter(b => b.status === 'pending').length;
        const completedBookings = bookings.filter(b => b.status === 'completed').length;
        const upcomingBookings = bookings.filter(b => 
          b.status === 'approved' && new Date(b.booking_datetime) > new Date()
        ).length;

        setUserStats({
          totalBookings,
          pendingBookings,
          completedBookings,
          upcomingBookings
        });

        setLoading(false);

      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }

    if (user) fetchUserDashboardData();

  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingService.cancel(bookingId);
      // Remove from local state
      setUserBookings(prev => prev.filter(booking => booking.id !== bookingId));
      // Update stats
      setUserStats(prev => ({
        ...prev,
        totalBookings: prev.totalBookings - 1,
        upcomingBookings: Math.max(0, prev.upcomingBookings - 1)
      }));
    } catch (error) {
      console.error(error);
      alert('Failed to cancel booking');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={styles.userDashboard}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.userDashboard}>
      <div className={styles.container}>
        {/* Welcome Header */}
        <div className={styles.welcomeHeader}>
          <h1>Welcome, {user.username}! 👋</h1>
          <p className={styles.welcomeText}>
            Manage your bookings and explore our services. Your personalized dashboard is ready.
          </p>
        </div>

        {/* User Stats Grid */}
        <div className={styles.userStatsGrid}>
          <div className={styles.userStatCard}>
            <div className={styles.userStatCardHeader}>
              <div className={styles.userStatCardTitle}>Total Bookings</div>
              <div className={`${styles.userStatCardIcon} ${styles.iconBookings}`}>
                📅
              </div>
            </div>
            <h3 className={styles.userStatCardValue}>{userStats.totalBookings}</h3>
          </div>

          <div className={styles.userStatCard}>
            <div className={styles.userStatCardHeader}>
              <div className={styles.userStatCardTitle}>Upcoming</div>
              <div className={`${styles.userStatCardIcon} ${styles.iconPending}`}>
                ⏳
              </div>
            </div>
            <h3 className={styles.userStatCardValue}>{userStats.upcomingBookings}</h3>
          </div>

          <div className={styles.userStatCard}>
            <div className={styles.userStatCardHeader}>
              <div className={styles.userStatCardTitle}>Completed</div>
              <div className={`${styles.userStatCardIcon} ${styles.iconCompleted}`}>
                ✅
              </div>
            </div>
            <h3 className={styles.userStatCardValue}>{userStats.completedBookings}</h3>
          </div>

          <div className={styles.userStatCard}>
            <div className={styles.userStatCardHeader}>
              <div className={styles.userStatCardTitle}>Available Services</div>
              <div className={`${styles.userStatCardIcon} ${styles.iconServices}`}>
                🛠️
              </div>
            </div>
            <h3 className={styles.userStatCardValue}>{availableServices.length}</h3>
            <Link to="/services" className={styles.viewAll}>
              View all →
            </Link>
          </div>
        </div>

        {/* Auth Message Card */}
        <div className={styles.userAuthMessage}>
          <div className={styles.userMessageCard}>
            <div className={styles.userMessageIcon}>
              🔐
            </div>
            <div className={styles.userMessageContent}>
              <p><strong>Welcome back!</strong> {message}</p>
              <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                You're logged in as <strong>{user.email}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className={styles.userContentGrid}>
          {/* Upcoming Bookings */}
          <div className={styles.upcomingBookings}>
            <div className={styles.sectionHeader}>
              <h2>Upcoming Bookings</h2>
              <Link to="/my-bookings" className={styles.viewAll}>
                View all
              </Link>
            </div>
            
            {userBookings.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>📅</div>
                <h3>No bookings yet</h3>
                <p>You haven't booked any services yet.</p>
                <Link to="/services">
                  <button className={styles.emptyStateButton}>
                    Browse Services
                  </button>
                </Link>
              </div>
            ) : (
              <div className={styles.bookingList}>
                {userBookings.map((booking) => (
                  <div key={booking.id} className={styles.bookingItem}>
                    <div className={styles.bookingHeader}>
                      <h3 className={styles.bookingTitle}>{booking.service?.name}</h3>
                      <span className={styles.bookingDate}>
                        {formatDate(booking.booking_datetime)}
                      </span>
                    </div>
                    
                    <div className={styles.bookingDetails}>
                      <div className={styles.bookingDetail}>
                        <span className={styles.bookingDetailIcon}>💰</span>
                        <span>{booking.service?.price} BHD</span>
                      </div>
                      <div className={styles.bookingDetail}>
                        <span className={styles.bookingDetailIcon}>⏱️</span>
                        <span>{booking.service?.duration_minutes} minutes</span>
                      </div>
                      <div className={styles.bookingDetail}>
                        <span className={styles.bookingDetailIcon}>📊</span>
                        <span>
                          <span className={`${styles.statusBadge} ${
                            booking.status === 'pending' ? styles.statusPending :
                            booking.status === 'approved' ? styles.statusApproved :
                            booking.status === 'completed' ? styles.statusCompleted :
                            styles.statusRejected
                          }`}>
                            {booking.status}
                          </span>
                        </span>
                      </div>
                    </div>
                    
                    <div className={styles.bookingActions}>
                      {booking.status === 'pending' && (
                        <>
                          <button className={`${styles.bookingButton} ${styles.primary}`}>
                            Reschedule
                          </button>
                          <button 
                            className={styles.bookingButton}
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status === 'approved' && (
                        <>
                          <button className={`${styles.bookingButton} ${styles.primary}`}>
                            View Details
                          </button>
                          <button 
                            className={styles.bookingButton}
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status === 'completed' && (
                        <button className={`${styles.bookingButton} ${styles.primary}`}>
                          Leave Review
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions & Services */}
          <div className={styles.userQuickActions}>
            <div className={styles.sectionHeader}>
              <h2>Quick Actions</h2>
            </div>
            
            <div className={styles.userActionsGrid}>
              <Link to="/services" className={styles.userActionButton}>
                <div className={styles.userActionIcon}>🔍</div>
                <div className={styles.userActionLabel}>Browse Services</div>
              </Link>

              <Link to="/my-bookings" className={styles.userActionButton}>
                <div className={styles.userActionIcon}>📋</div>
                <div className={styles.userActionLabel}>My Bookings</div>
              </Link>

              <Link to="/profile" className={styles.userActionButton}>
                <div className={styles.userActionIcon}>👤</div>
                <div className={styles.userActionLabel}>Profile</div>
              </Link>

              <Link to="/support" className={styles.userActionButton}>
                <div className={styles.userActionIcon}>💬</div>
                <div className={styles.userActionLabel}>Support</div>
              </Link>
            </div>

            {/* Available Services */}
            <div className={styles.sectionHeader} style={{ marginTop: '2rem' }}>
              <h2>Featured Services</h2>
              <Link to="/services" className={styles.viewAll}>
                View all
              </Link>
            </div>
            
            <div className={styles.servicesGrid}>
              {availableServices.length === 0 ? (
                <div className={styles.emptyState} style={{ padding: '1rem', gridColumn: '1 / -1' }}>
                  <p>No services available</p>
                </div>
              ) : (
                availableServices.map((service) => (
                  <div key={service.id} className={styles.serviceCard}>
                    <h4 className={styles.serviceName}>{service.name}</h4>
                    <div className={styles.servicePrice}>{service.price} BHD</div>
                    <div className={styles.serviceDuration}>
                      ⏱️ {service.duration_minutes} min
                    </div>
                    <Link to={`/services/${service.id}/book`}>
                      <button className={styles.serviceButton}>
                        Book Now
                      </button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;