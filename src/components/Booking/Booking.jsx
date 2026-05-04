import React, { useEffect, useState } from 'react'
import * as bookingService from '../../services/bookingService'

import styles from '../Booking/Booking.module.css';
import { toast } from 'react-toastify';

function Booking() {
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true)
        const data = await bookingService.show()
        setBookings(data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const updated = await bookingService.update(bookingId, newStatus)
      setBookings(prev => prev.filter(booking => booking.id !== bookingId))
      toast.success(`Booking ${newStatus}`)
    } catch (error) {
      console.error(error)
    }
  }

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved':
      case 'confirmed':
      case 'completed':
        return styles.statusApproved
      case 'pending':
        return styles.statusPending
      case 'rejected':
      case 'cancelled':
        return styles.statusRejected
      default:
        return styles.statusDefault
    }
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-US', { 
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
        <p>Loading bookings...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Bookings</h1>
        {bookings.length > 0 && (
          <p className={styles.subtitle}>Showing all bookings</p>
        )}
      </div>

      {bookings.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <h2>No Bookings</h2>
          <p>There are no bookings at the moment.</p>
        </div>
      ) : (
        <div className={styles.bookingList}>
          {bookings.map((booking) => {
            const formattedDate = formatDateTime(booking.booking_datetime)
            
            return (
              <div key={booking.id} className={styles.bookingCard}>
                <div className={styles.bookingHeader}>
                  <div>
                    <h3 className={styles.serviceName}>{booking.service.name}</h3>
                    <p className={styles.userInfo}>
                      Booked by: <strong>{booking.user.username}</strong>
                    </p>
                  </div>
                  <div className={styles.headerRight}>
                    <div className={styles.priceBadge}>${booking.service.price}</div>
                    <div className={`${styles.statusBadge} ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </div>
                  </div>
                </div>

                <div className={styles.bookingDetails}>
                  <div className={styles.detailGrid}>
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
                      <span className={styles.detailValue}>{booking.service.duration_minutes} min</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Booking ID</span>
                      <span className={styles.detailValue}>#{booking.id}</span>
                    </div>
                  </div>

                  {booking.service.description && (
                    <div className={styles.description}>
                      <span className={styles.descriptionLabel}>Service Description:</span>
                      <p className={styles.descriptionText}>{booking.service.description}</p>
                    </div>
                  )}
                </div>

                {booking.status === 'pending' && (
                  <div className={styles.actionSection}>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.approveButton}
                        onClick={() => handleStatusChange(booking.id, 'approved')}
                      >
                        ✓ Approve
                      </button>
                      <button
                        className={styles.rejectButton}
                        onClick={() => handleStatusChange(booking.id, 'rejected')}
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Booking