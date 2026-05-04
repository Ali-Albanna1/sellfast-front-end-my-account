import React, { useEffect, useState } from 'react'
import * as orderService from '../../services/orderService'
import { useNavigate, useLocation  } from 'react-router'

import styles from '../Order/Order.module.css';

function Order() {
  const location = useLocation()
  const [orderError, setOrderError] = useState(location.state?.error || "")
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
  if (orderError) {
    const timer = setTimeout(() => setOrderError(""), 4000)
    return () => clearTimeout(timer)
  }
}, [orderError])

  useEffect(() => {
    const getOrders = async () => {
      setLoading(true)
      try {
        const data = await orderService.show()
        setOrders(data)
      } catch (err) {
        setError("Failed to fetch orders")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    getOrders()
  }, [])

  const filteredOrders = orders.filter(order =>
    order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toString().includes(searchTerm) ||
    order.total_price.toString().includes(searchTerm)
  )

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return styles.statusCompleted
      case 'pending':
      case 'processing':
        return styles.statusPending
      case 'cancelled':
      case 'rejected':
        return styles.statusCancelled
      default:
        return styles.statusDefault
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading orders...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error</h2>
        <p>{error}</p>
        <button 
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Orders</h1>
              {orderError && (
        <div style={{
          background: '#ffe0e0',
          color: '#900',
          padding: '10px',
          borderRadius: '6px',
          marginBottom: '1rem',
          border: '1px solid #ffb3b3'
        }}>
          {orderError}
        </div>
      )}

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <div className={styles.searchIcon}>🔍</div>
        </div>

        {filteredOrders.length === 0 && searchTerm && (
          <p className={styles.noResults}>No orders found for "{searchTerm}"</p>
        )}
      </div>

      {filteredOrders.length === 0 && !searchTerm ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📦</div>
          <h2>No Orders</h2>
          <p>There are no orders to display.</p>
        </div>
      ) : (
        <div className={styles.orderList}>
          {filteredOrders.map(order => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div className={styles.orderInfo}>
                  <h3 className={styles.orderId}>Order #{order.id}</h3>
                  <div className={`${styles.statusBadge} ${getStatusColor(order.status)}`}>
                    {order.status}
                  </div>
                </div>
                <div className={styles.priceBadge}>
                  ${order.total_price.toFixed(2)}
                </div>
              </div>

              <div className={styles.orderMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Created:</span>
                  <span className={styles.metaValue}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
                {order.updated_at && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Updated:</span>
                    <span className={styles.metaValue}>
                      {new Date(order.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <button
                className={styles.detailsButton}
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Order