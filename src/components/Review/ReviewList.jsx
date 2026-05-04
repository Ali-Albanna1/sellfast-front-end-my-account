import React from 'react'
import ReviewItem from './ReviewItem'

/**
ReviewList Component
  
Displays a list of all reviews
 
*/
function ReviewList({ reviews, currentUserId, onEditReview, onDeleteReview }) {
  
  // Show empty state if no reviews
  if (reviews.length === 0) {
    return (
      <div style={{ 
        padding: '40px',
        textAlign: 'center',
        color: '#6b7280',
        backgroundColor: '#f9fafb',
        borderRadius: '8px'
      }}>
        <p>No reviews yet. Be the first to review this product!</p>
      </div>
    )
  }

  return (
    <div>
      <h3 style={{ marginBottom: '20px', fontSize: '1.25rem', fontWeight: '600' }}>
        All Reviews ({reviews.length})
      </h3>

      <div>
        {reviews.map((review) => (
          <ReviewItem
            key={review.id}
            review={review}
            currentUserId={currentUserId}
            onEdit={onEditReview}
            onDelete={onDeleteReview}
          />
        ))}
      </div>
    </div>
  )
}

export default ReviewList