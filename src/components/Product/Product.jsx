import React, { useEffect, useState } from 'react'
import * as productService from '../../services/productService'
import { useNavigate } from 'react-router'
import * as cartitemService from '../../services/cartitemService'

import styles from '../Product/Product.module.css';

function Product({user}) {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsLoading(true)
        const products = await productService.show()
        setProducts(products)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    getProducts()
  }, [])

  // Fetch user's cart items
  useEffect(() => {
    const getCartItems = async () => {
      if (!user?.cartId || isNaN(user.cartId)) return;
      if (!user) return
      try {
        const items = await cartitemService.getCartItems(user.cartId)
        setCartItems(items)
      } catch (error) {
        console.error(error)
      }
    }
    getCartItems()
  }, [user])

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Check if a product is already in cart
  const isInCart = (productId) => {
    return cartItems.some(item => item.product_id === productId)
  }

  const handleAddToCart = async (productId) => {
    if (!user) {
      alert('You must be signed in to add items to cart')
      return
    }

    try {
      const newItem = await cartitemService.createCartItem(user.cartId, { product_id: productId, quantity: 1 })
      // Update local state so the UI updates immediately
      setCartItems(prev => [...prev, newItem])
    } catch (error) {
      console.error(error)
    }
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading products...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Products</h1>
        
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <div className={styles.searchIcon}>🔍</div>
        </div>

        {filteredProducts.length === 0 && searchTerm && (
          <p className={styles.noResults}>No products found for "{searchTerm}"</p>
        )}
      </div>

      <div className={styles.productList}>
        {filteredProducts.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <div className={styles.imageContainer}>
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.productImage}
                  loading="lazy"
                />
              ) : (
                <div className={styles.imagePlaceholder}>No Image</div>
              )}
              
              {!product.is_available && (
                <div className={styles.unavailableBadge}>Unavailable</div>
              )}
            </div>

            <div className={styles.productInfo}>
              <h3 className={styles.productName}>{product.name}</h3>
              
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Price:</span>
                  <span className={styles.detailValue}>${product.price}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Stock:</span>
                  <span className={`${styles.stockValue} ${product.stock === 0 ? styles.outOfStock : ''}`}>
                    {product.stock} units
                  </span>
                </div>
              </div>

              <div className={styles.actions}>
                <button 
                  className={styles.detailsButton}
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  View Details
                </button>

                {product.is_available && !user?.is_admin && user && (
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
                        ? '✓ In Cart' 
                        : 'Add to Cart'
                    }
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Product