import React from 'react'

function StarRating({ rating, onRatingChange, size = 'medium', interactive = false }) {
  
  // Define star sizes using inline styles for simplicity
  const sizes = {
    small: { fontSize: '1rem' },     
    medium: { fontSize: '1.5rem' },  
    large: { fontSize: '2rem' }       
  }

  // Array of star positions [1, 2, 3, 4, 5]
  const stars = [1, 2, 3, 4, 5]

  //Handle star click
  const handleClick = (value) => {
    if (interactive && onRatingChange) {
      if (rating === value) {
        onRatingChange(value - 0.5)  // Make it half star
      } else {
        onRatingChange(value) 
      }
    }
  }

  /**
   * Get star color based on rating
   * - Full star (value <= rating): yellow
   * - Empty star (value > rating): gray
   */
  const getStarColor = (starValue) => {
    return starValue <= rating ? '#fbbf24' : '#d1d5db'
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {stars.map((star) => (
        <span
          key={star}
          onClick={() => handleClick(star)}
          style={{
            ...sizes[size],
            color: getStarColor(star),
            cursor: interactive ? 'pointer' : 'default',
            transition: 'transform 0.2s',
            userSelect: 'none'
          }}
          onMouseEnter={(e) => interactive && (e.target.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => interactive && (e.target.style.transform = 'scale(1)')}
        >
          ★
        </span>
      ))}
      
      {/* Show numeric rating next to stars */}
      {rating > 0 && (
        <span style={{ marginLeft: '8px', color: '#6b7280', fontSize: '0.9rem' }}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

export default StarRating