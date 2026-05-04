import React, { useState, useEffect } from 'react'
import StarRating from './StarRating'

function ReviewForm({ productId, existingReview, onSubmit, onCancel }) {
  
  // Form state
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  
   // Initialize form with existing data if editing
    //This runs when existingReview changes
   
  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating)
      setComment(existingReview.comment || '')
    }
  }, [existingReview])

  
  //Form validation
  const validateForm = () => {
    setError('')

    if (rating === 0) {
      setError('Please select a rating')
      return false
    }

    if (rating % 0.5 !== 0) {
      setError('Rating must be in 0.5 increments (1, 1.5, 2, etc.)')
      return false
    }

    if (comment.length > 1000) {
      setError('Comment must be less than 1000 characters')
      return false
    }

    return true
  }

  
   // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()  // Prevent page reload

    if (!validateForm()) return

    setLoading(true)
    setError('')

    try {
      await onSubmit({ rating, comment })
      
      // Reset form only if creating new review (not editing)
      if (!existingReview) {
        setRating(0)
        setComment('')
      }
    } catch (err) {
      
      const errorMsg = err.response?.data?.detail || 'Failed to submit review'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      backgroundColor: '#f9fafb',
      padding: '24px',
      borderRadius: '8px',
      marginBottom: '24px'
    }}>
      <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px' }}>
        {existingReview ? 'Edit Your Review' : 'Write a Review'}
      </h4>

      <form onSubmit={handleSubmit}>
        
        {/* Rating Selection */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            Your Rating *
          </label>
          
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            interactive={true}
            size="large"
          />
          
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
            Click a star to select. Click again for half star.
          </p>
        </div>

        {/* Comment Input */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            Your Review (Optional)
          </label>
          
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            maxLength={1000}
            rows={4}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.875rem',
              resize: 'vertical'
            }}
          />
          
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
            {comment.length}/1000 characters
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            color: '#991b1b',
            fontSize: '0.875rem',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#9ca3af' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '500'
            }}
          >
            {loading ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '10px 20px',
                backgroundColor: '#e5e7eb',
                color: '#374151',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default ReviewForm