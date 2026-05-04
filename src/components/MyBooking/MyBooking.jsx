import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import * as bookingService from '../../services/bookingService'

import styles from '../MyBooking/MyBooking.module.css';

function MyBooking() {
  const [myBookings, setMyBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const getBookings = async () => {
      try {
        setIsLoading(true)
        const bookings = await bookingService.myBookings()
        setMyBookings(bookings)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    getBookings()
  }, [])

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'confirmed':
      case 'completed':
        return styles.statusConfirmed
      case 'pending':
        return styles.statusPending
      case 'cancelled':
        return styles.statusCancelled
      default:
        return styles.statusDefault
    }
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your bookings...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Bookings</h1>
        {myBookings.length > 0 && (
          <p className={styles.subtitle}>
            You have {myBookings.length} booking{myBookings.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {myBookings.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📅</div>
          <h2>No Bookings Yet</h2>
          <p>You haven't booked any services yet.</p>
          <button 
            className={styles.ctaButton}
            onClick={() => navigate('/services')}
          >
            Browse Services
          </button>
        </div>
      ) : (
        <div className={styles.bookingList}>
          {myBookings.map((booking) => {
            const formattedDate = formatDateTime(booking.booking_datetime)
            
            return (
              <div key={booking.id} className={styles.bookingCard}>
                <div className={styles.bookingHeader}>
                  <div className={styles.serviceInfo}>
                    <h3 className={styles.serviceName}>{booking.service.name}</h3>
                    <div className={styles.priceBadge}>${booking.service.price}</div>
                  </div>
                  <div className={`${styles.statusBadge} ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </div>
                </div>

                <div className={styles.bookingDetails}>
                  <div className={styles.detailRow}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Date</span>
                      <span className={styles.detailValue}>{formattedDate.date}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Time</span>
                      <span className={styles.detailValue}>{formattedDate.time}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Duration</span>
                      <span className={styles.detailValue}>{booking.service.duration_minutes} minutes</span>
                    </div>
                  </div>

                  {booking.service.description && (
                    <div className={styles.description}>
                      <span className={styles.descriptionLabel}>Description:</span>
                      <p className={styles.descriptionText}>{booking.service.description}</p>
                    </div>
                  )}

                  <div className={styles.bookingMeta}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Booking ID:</span>
                      <span className={styles.metaValue}>#{booking.id}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Booked On:</span>
                      <span className={styles.metaValue}>
                        {new Date(booking.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyBooking