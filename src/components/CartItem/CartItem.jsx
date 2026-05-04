import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router'
import * as cartitemService from '../../services/cartitemService'
import * as orderService from '../../services/orderService'
import { toast } from 'react-toastify'

import styles from './CartItem.module.css';

function CartItem() {
  const [cartitems, setCardItem] = useState([])
  const [stockError, setStockError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const {id} = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (stockError) {
      const timer = setTimeout(() => setStockError(''), 4000)
      return () => clearTimeout(timer)
    }
  }, [stockError])

  useEffect(() => {
    const cartItems = async (id) => {
      try {
        setIsLoading(true)
        const foundCartItem = await cartitemService.getCartItems(id)
        setCardItem(foundCartItem)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) cartItems(id)
  }, [id])

  const handleAddOrder = async () => {
    if (!cartitems || cartitems.length === 0) return;

    setStockError('')
  
    const orderPayload = {
      user_id: 0,
      total_price: 0,
      items: cartitems.map(cartItem => ({
        product_id: cartItem.product_id,
        product_name: "",
        price: 0,
        quantity: cartItem.quantity
      }))
    };
    
    try {
      await orderService.create(orderPayload);
      await Promise.all(cartitems.map(item => cartitemService.deleteOne(item.id)));
      setCardItem([]);
      navigate("/orders");
      toast.success("Order created successfully")
    } catch (error) {
      const message = error.response?.data?.detail
      if (message) {
        setStockError(message)
      } else {
        setStockError("Failed to create order")
      }
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await cartitemService.deleteOne(itemId)
      setCardItem(prev => prev.filter(item => item.id !== itemId))
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async (itemId, quantity) => {
    try {
      await cartitemService.update(itemId, { quantity })
      // Show success feedback (could add a toast/notification here)
    } catch (error) {
      console.error(error)
    }
  }

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return
    setCardItem(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantity: Number(newQuantity) }
          : item
      )
    )
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading cart...</p>
      </div>
    )
  }

  const totalPrice = cartitems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Shopping Cart</h1>
          {cartitems.length > 0 && (
            <p className={styles.itemCount}>{cartitems.length} item{cartitems.length !== 1 ? 's' : ''}</p>
          )}
        </div>
      </div>

      {stockError && (
        <div className={styles.errorMessage}>
          ⚠ {stockError}
        </div>
      )}

      {cartitems.length === 0 ? (
        <div className={styles.emptyCart}>
          <div className={styles.emptyIcon}>🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <button 
            className={styles.continueButton}
            onClick={() => navigate('/products')}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <>
          <div className={styles.cartList}>
            {cartitems.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemHeader}>
                  <h3 className={styles.productName}>{item.product_name}</h3>
                  <div className={styles.priceBadge}>${item.price.toFixed(2)}</div>
                </div>

                <div className={styles.itemDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Product ID:</span>
                    <span className={styles.detailValue}>#{item.product_id}</span>
                  </div>
                  
                  <div className={styles.quantitySection}>
                    <div className={styles.quantityControl}>
                      <label className={styles.quantityLabel}>Quantity:</label>
                      <div className={styles.quantityInputGroup}>
                        <button
                          className={styles.quantityBtn}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, e.target.value)}
                          className={styles.quantityInput}
                        />
                        <button
                          className={styles.quantityBtn}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className={styles.updateButton}
                        onClick={() => handleSubmit(item.id, item.quantity)}
                      >
                        Update
                      </button>
                    </div>
                    <div className={styles.itemSubtotal}>
                      <span className={styles.subtotalLabel}>Subtotal:</span>
                      <span className={styles.subtotalValue}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className={styles.summarySection}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Order Summary</h3>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Items ({cartitems.length}):</span>
                <span className={styles.summaryValue}>
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Total:</span>
                <span className={styles.totalPrice}>${totalPrice.toFixed(2)}</span>
              </div>
              <button
                className={styles.checkoutButton}
                disabled={cartitems.length === 0}
                onClick={handleAddOrder}
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CartItem