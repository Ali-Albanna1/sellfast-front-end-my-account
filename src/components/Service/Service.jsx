import React, { useEffect, useState } from 'react'
import * as serviceService from '../../services/serviceService'
import { useNavigate } from 'react-router'

import styles from '../Service/Service.module.css';

function Service({user}) {
  const [services, setServices] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const navigate = useNavigate()
  
  useEffect(() => {
    const getServices = async () => {
      try {
        setIsLoading(true)
        const service = await serviceService.show()
        setServices(service)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    getServices()
  }, [])

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading services...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Services</h1>
        
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search services by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <div className={styles.searchIcon}>🔍</div>
        </div>

        {filteredServices.length === 0 && searchTerm && (
          <p className={styles.noResults}>No services found for "{searchTerm}"</p>
        )}
      </div>

      <div className={styles.serviceList}>
        {filteredServices.map((service) => (
          <div key={service.id} className={styles.serviceCard}>
            <div className={styles.imageContainer}>
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.name}
                  className={styles.serviceImage}
                  loading="lazy"
                />
              ) : (
                <div className={styles.imagePlaceholder}>No Image</div>
              )}
              
              {!service.is_available && (
                <div className={styles.unavailableBadge}>Unavailable</div>
              )}
            </div>

            <div className={styles.serviceInfo}>
              <h3 className={styles.serviceName}>{service.name}</h3>
              
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Price:</span>
                  <span className={styles.detailValue}>${service.price}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Status:</span>
                  <span className={`${styles.statusValue} ${service.is_available ? styles.available : styles.unavailable}`}>
                    {service.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>

              <div className={styles.actions}>
                <button 
                  className={styles.detailsButton}
                  onClick={() => navigate(`/services/${service.id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Service