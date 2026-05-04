import React from 'react'
import StarRating from './StarRating'

/**
  ReviewStats Component
 
  Displays review statistics:
 - Average rating
 - Total review count
 - Rating distribution (1-5 stars breakdown)
 
 */
function ReviewStats({ stats }) {
  
  // Don't show if no stats or no reviews
  if (!stats || stats.total_reviews === 0) {
    return null
  }

  const { average_rating, total_reviews, rating_distribution } = stats

  
  //Calculate percentage for distribution bar
   
  const getPercentage = (count) => {
    if (total_reviews === 0) return 0
    return (count / total_reviews) * 100
  }

  return (
    <div style={{
      padding: '24px',
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      marginBottom: '32px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        
        {/* ===== AVERAGE RATING ===== */}
        <div style={{ textAlign: 'center', minWidth: '120px' }}>
          <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>
            {average_rating.toFixed(1)}
          </div>
          <StarRating rating={average_rating} size="small" />
          <div style={{ color: '#6b7280', marginTop: '4px', fontSize: '0.875rem' }}>
            {total_reviews} {total_reviews === 1 ? 'review' : 'reviews'}
          </div>
        </div>

        {/* ===== RATING DISTRIBUTION ===== */}
        <div style={{ flex: 1 }}>
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '4px'
            }}>
              {/* Star Label */}
              <span style={{ width: '32px', fontSize: '0.875rem' }}>
                {star} ★
              </span>
              
              {/* Progress Bar */}
              <div style={{
                flex: 1,
                height: '16px',
                backgroundColor: '#e5e7eb',
                borderRadius: '9999px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${getPercentage(rating_distribution[star])}%`,
                  backgroundColor: '#fbbf24',
                  transition: 'width 0.3s'
                }} />
              </div>
              
              {/* Count */}
              <span style={{ 
                width: '48px', 
                textAlign: 'right',
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>
                {rating_distribution[star]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReviewStats