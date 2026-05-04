import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router';
import * as orderService from '../../services/orderService'
import { toast } from 'react-toastify';

import styles from '../OrderDetails/OrderDetails.module.css';

function OrderDetails({user}) {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [newStatus, setNewStatus] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const navigate = useNavigate() 

  useEffect(() => {
  if (!user) return; //  wait until user is loaded

  const fetchOrder = async () => {
    try {
      setIsLoading(true)

      const data = await orderService.getOne(id)

      // permission check AFTER user exists
      if (!user.is_admin && data.user_id !== user.id) {
          setPermissionDenied(true)
          setOrder(null)
          return
      }

      setOrder(data)
    } catch (error) {
        if (error.response?.status === 404) {
          setNotFound(true)
        } else {
          toast.error("Failed to load order")
          navigate('/orders')
      }
    } finally {
      setIsLoading(false)
    }
  }

  fetchOrder()
}, [id, user, navigate])


  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === order.status) return
    
    try {
      const updated = await orderService.update(order.id, { status: newStatus })
      setOrder(updated)
       toast.success(`Order is ${newStatus}`)
      setNewStatus("")
    } catch (error) {
      console.error("Failed to update status", error)
      toast.error("Failed to update order status")
    }
  }

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return styles.statusCompleted
      case 'pending':
      case 'processing':
        return styles.statusPending
      case 'cancelled':
        return styles.statusCancelled
      case 'shipped':
        return styles.statusShipped
      default:
        return styles.statusDefault
    }
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading order details...</p>
      </div>
    )
  }

  if (permissionDenied) {
    return (
      <div className={styles.errorContainer}>
        <h2>Access Denied</h2>
        <p>You don’t have permission to view this order.</p>
        <button
          className={styles.backButton}
          onClick={() => navigate('/orders')}
        >
          Back to Orders
        </button>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className={styles.errorContainer}>
        <h2>Order Not Found</h2>
        <p>The order you're looking for doesn't exist.</p>
        <button
          className={styles.backButton}
          onClick={() => navigate('/orders')}
        >
          Back to Orders
        </button>
      </div>
    )
  }

  if (!order) return null

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/orders')}
        >
          ← Back to Orders
        </button>
        <h1 className={styles.title}>Order Details</h1>
      </div>

      <div className={styles.orderContainer}>
        {/* Order Header */}
        <div className={styles.orderHeader}>
          <div>
            <h2 className={styles.orderId}>Order #{order.id}</h2>
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
          </div>
          <div className={styles.orderStatus}>
            <div className={`${styles.statusBadge} ${getStatusColor(order.status)}`}>
              {order.status}
            </div>
            <div className={styles.totalPrice}>${order.total_price.toFixed(2)}</div>
          </div>
        </div>

        {/* Order Items */}
        <div className={styles.itemsSection}>
          <h3 className={styles.sectionTitle}>Order Items</h3>
          <div className={styles.itemsGrid}>
            {order.items.map(item => (
              <div key={item.id} className={styles.itemCard}>
                <div className={styles.itemHeader}>
                  <h4 className={styles.itemName}>{item.product_name}</h4>
                  <div className={styles.itemPrice}>${item.price}</div>
                </div>
                <div className={styles.itemDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Quantity:</span>
                    <span className={styles.detailValue}>{item.quantity}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Subtotal:</span>
                    <span className={styles.subtotalValue}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className={styles.orderSummary}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Items Total:</span>
              <span className={styles.summaryValue}>
                ${order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Order Total:</span>
              <span className={styles.totalValue}>${order.total_price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        {user.is_admin && (
          <div className={styles.adminSection}>
            <h3 className={styles.sectionTitle}>Update Order Status</h3>
            <div className={styles.statusUpdate}>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className={styles.statusSelect}
              >
                <option value="">Select new status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <button
                className={`${styles.updateButton} ${!newStatus ? styles.disabled : ''}`}
                onClick={handleStatusUpdate}
                disabled={!newStatus}
              >
                Update Status
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderDetails