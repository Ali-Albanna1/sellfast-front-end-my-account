import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router'
import * as productService from '../../services/productService'
import * as cartitemService from '../../services/cartitemService'

import styles from '../ProductDetails/ProductDetails.module.css';
import ReviewSection from '../Review/ReviewSection'

import { toast } from 'react-toastify'

function ProductDetails({user}) {
  const [product, setProduct] = useState(null)
  const {id} = useParams()
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const productDetails = async (id) => {
      try {
        setIsLoading(true)
        const foundProduct = await productService.details(id)
        setProduct(foundProduct)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) productDetails(id)
  }, [id])

  useEffect(() => {
    const fetchCartItems = async () => {
       if (!user?.cartId || isNaN(user.cartId)) return;
      if (!user) return
      try {
        const items = await cartitemService.getCartItems(user.cartId)
        setCartItems(items)
      } catch (error) {
        console.error(error)
      }
    }
    fetchCartItems()
  }, [user])

  const handleDelete = async (id) => {
    try {
      const deletedProduct = await productService.deleteOne(id)
      if(deletedProduct) {
        navigate('/products')
        toast.success("Product succefully deleted")
      }
    } catch (error) {
      console.error(error)
      toast.error("Could not delete")
    }
  }

  const isInCart = (productId) => {
    return cartItems.some(item => item.product_id === productId)
  }

  const handleAddToCart = async (productId) => {
    if (!user) {
      toast.warning('You must be signed in to add items to cart')
      return
    }

    try {
      const newItem = await cartitemService.createCartItem(user.cartId, { product_id: productId, quantity: 1 })
      setCartItems(prev => [...prev, newItem])
    } catch (error) {
      console.error(error)
    }
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading product details...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className={styles.errorContainer}>
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/products')}
        >
          Back to Products
        </button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/products')}
        >
          ← Back to Products
        </button>
        <h1 className={styles.title}>{product.name}</h1>
      </div>

      <div className={styles.productContainer}>
        {/* Product Image */}
        <div className={styles.imageSection}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className={styles.productImage}
            />
          ) : (
            <div className={styles.imagePlaceholder}>
              No Image Available
            </div>
          )}
          
          {!product.is_available && (
            <div className={styles.unavailableBanner}>
              Currently Unavailable
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={styles.infoSection}>
          <div className={styles.productHeader}>
            <h2 className={styles.productName}>{product.name}</h2>
            <div className={styles.priceTag}>${product.price}</div>
          </div>

          <div className={styles.statusInfo}>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Status:</span>
              <span className={`${styles.statusValue} ${product.is_available ? styles.available : styles.unavailable}`}>
                {product.is_available ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Stock:</span>
              <span className={styles.stockValue}>{product.stock} units</span>
            </div>
          </div>

          <div className={styles.descriptionSection}>
            <h3 className={styles.sectionTitle}>Description</h3>
            <p className={styles.description}>{product.description || 'No description available.'}</p>
          </div>

          {/* Add to Cart Button */}
          {product.is_available && !user?.is_admin && user && (
            <div className={styles.cartSection}>
              <button
                className={`${styles.cartButton} ${
                  isInCart(product.id) ? styles.inCart : 
                  product.stock === 0 ? styles.disabled : ''
                }`}
                onClick={() => handleAddToCart(product.id)}
                disabled={isInCart(product.id) || product.stock === 0}
              >
                {product.stock === 0 
                  ? 'Out of Stock' 
                  : isInCart(product.id) 
                    ? '✓ Added to Cart' 
                    : 'Add to Cart'
                }
              </button>
            </div>
          )}

          {/* Admin Actions */}
          {user && user.is_admin && (
            <div className={styles.adminSection}>
              <h3 className={styles.sectionTitle}>Admin Actions</h3>
              <div className={styles.adminButtons}>
                <button
                  className={styles.editButton}
                  onClick={() => navigate(`/products/${product.id}/update`)}
                >
                  Edit Product
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(product.id)}
                >
                  Delete Product
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewSection productId={id} user={user} />
    </div>
  )
}

export default ProductDetails