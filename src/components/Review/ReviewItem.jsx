import React from 'react'
import StarRating from './StarRating'

/*
  ReviewItem Component
  
  Displays a single review card
 
 */
function ReviewItem({ review, currentUserId }) {
  
  // Check if this review belongs to current user
  const isOwner = currentUserId && review.user_id === currentUserId


 // Format date to readable string
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div style={{
      padding: '20px',
      marginBottom: '16px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: 'white'
    }}>
      
      {/* ===== USER INFO & RATING ===== */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: '12px',
        marginBottom: '12px'
      }}>
        {/* User Avatar */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '600',
          color: '#6b7280',
          fontSize: '0.875rem'
        }}>
           {review.username ? review.username[0].toUpperCase() : review.user_id}
        </div>

        {/* User Name & Stars */}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>
            {review.username || `User #${review.user_id}`}
            {/* Show "(You)" label if this is the current user's review */}
            {isOwner && (
              <span style={{ 
                marginLeft: '8px', 
                fontSize: '0.75rem', 
                color: '#3b82f6',
                fontWeight: 'normal'
              }}>
                (You)
              </span>
            )}
          </div>
          <StarRating rating={review.rating} size="small" />
        </div>

      </div>

      {/* ===== COMMENT ===== */}
      {review.comment && (
        <p style={{ 
          color: '#374151',
          lineHeight: '1.6',
          marginBottom: '12px'
        }}>
          {review.comment}
        </p>
      )}

      {/* ===== DATE ===== */}
      <p style={{ 
        fontSize: '0.875rem',
        color: '#6b7280'
      }}>
        {formatDate(review.created_at)}
      </p>
    </div>
  )
}

export default ReviewItem