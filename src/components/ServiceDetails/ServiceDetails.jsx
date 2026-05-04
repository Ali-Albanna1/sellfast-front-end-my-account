import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router'
import * as serviceService from '../../services/serviceService'
import * as bookingService from '../../services/bookingService'

import styles from '../ServiceDetails/ServiceDetails.module.css';

import { toast } from 'react-toastify'

function ServiceDetails({user}) {
  const [service, setService] = useState(null)
  const {id} = useParams()
  const [bookingDate, setBookingDate] = useState("")
  const [bookingError, setBookingError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  
  const navigate = useNavigate()

    useEffect(() => {
           if (bookingError) {
              const timer = setTimeout(() => setBookingError(''), 4000)
             return () => clearTimeout(timer)
          }
         }, [bookingError])

    useEffect(() => {
    const serviceDetails = async (id) => {
      try {
        setIsLoading(true)
        const foundService = await serviceService.details(id)
        setService(foundService)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) serviceDetails(id)
  }, [id])

  const handleDelete = async (id) => {
    try {
      const deletedService = await serviceService.deleteOne(id)
      if(deletedService) {
        navigate('/services')
        toast.success("Service deleted successfully!")
      }
    } catch (error) {
      console.error(error)
       toast.error("Could not delete service")

    }
  }

  const handleBooking = async () => {
    try {
      setBookingError("")
      await bookingService.create({
        service_id: service.id,
        booking_datetime: bookingDate
      })
      navigate('/bookings/me')
      toast.success("Successfully booked")
    } catch (error) {
      console.error(error)
      if (error.response && error.response.data?.detail) {
        setBookingError(error.response.data.detail)
      } else {
        setBookingError("Something went wrong. Please try again.")
      }
    }
  }
    
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading service details...</p>
      </div>
    )
  }

  if (!service) {
    return (
      <div className={styles.errorContainer}>
        <h2>Service Not Found</h2>
        <p>The service you're looking for doesn't exist or has been removed.</p>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/services')}
        >
          Back to Services
        </button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/services')}
        >
          ← Back to Services
        </button>
        <h1 className={styles.title}>{service.name}</h1>
      </div>

      <div className={styles.serviceContainer}>
        {/* Service Image */}
        <div className={styles.imageSection}>
          {service.image ? (
            <img
              src={service.image}
              alt={service.name}
              className={styles.serviceImage}
            />
          ) : (
            <div className={styles.imagePlaceholder}>
              No Image Available
            </div>
          )}
          
          {!service.is_available && (
            <div className={styles.unavailableBanner}>
              Currently Unavailable
            </div>
          )}
        </div>

        {/* Service Info */}
        <div className={styles.infoSection}>
          <div className={styles.serviceHeader}>
            <h2 className={styles.serviceName}>{service.name}</h2>
            <div className={styles.priceTag}>${service.price}</div>
          </div>

          <div className={styles.statusInfo}>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Status:</span>
              <span className={`${styles.statusValue} ${service.is_available ? styles.available : styles.unavailable}`}>
                {service.is_available ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Duration:</span>
              <span className={styles.durationValue}>{service.duration_minutes} minutes</span>
            </div>
          </div>

          <div className={styles.descriptionSection}>
            <h3 className={styles.sectionTitle}>Description</h3>
            <p className={styles.description}>{service.description || 'No description available.'}</p>
          </div>

          {/* Booking Section */}
          {user && service.is_available && (
            <div className={styles.bookingSection}>
              <h3 className={styles.sectionTitle}>Book This Service</h3>
              
              <div className={styles.bookingForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Select Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    min={new Date().toISOString().slice(0, 16)}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className={styles.bookingInput}
                  />
                  <small className={styles.formHint}>
                    Choose a future date and time for your appointment
                  </small>
                </div>
                
                <button
                  onClick={handleBooking}
                  disabled={!bookingDate}
                  className={`${styles.bookButton} ${!bookingDate ? styles.disabled : ''}`}
                >
                  Book Appointment
                </button>
                
                {bookingError && (
                  <div className={styles.errorMessage}>
                    ⚠ {bookingError}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Admin Actions */}
          {user && user.is_admin && (
            <div className={styles.adminSection}>
              <h3 className={styles.sectionTitle}>Admin Actions</h3>
              <div className={styles.adminButtons}>
                <button
                  className={styles.editButton}
                  onClick={() => navigate(`/services/${service.id}/update`)}
                >
                  Edit Service
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(service.id)}
                >
                  Delete Service
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ServiceDetails