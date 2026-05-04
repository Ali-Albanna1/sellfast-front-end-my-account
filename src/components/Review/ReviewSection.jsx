import React, { useState, useEffect } from 'react'
import * as reviewService from '../../services/reviewService'
import ReviewStats from './ReviewStats'
import ReviewForm from './ReviewForm'
import ReviewList from './ReviewList'
import StarRating from './StarRating'

function ReviewSection({ productId, user }) {
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState(null)
  const [userReview, setUserReview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  // JWT sub → integer user id
  const userId = user?.sub ? parseInt(user.sub, 10) : null

  useEffect(() => {
    if (productId) {
      loadReviewData()
    }
   
  }, [productId, userId])

  const loadReviewData = async () => {
    setLoading(true)
    try {
      const [reviewsData, statsData] = await Promise.all([
        reviewService.show(productId),
        reviewService.reviewStatShow(productId)
      ])

      setReviews(reviewsData)
      setStats(statsData)

      if (userId) {
        const myReview = reviewsData.find(r => r.user_id === userId)
        setUserReview(myReview || null)
      } else {
        setUserReview(null)
      }
    } catch (error) {
      console.log('Error loading reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  // CREATE
  const handleCreateReview = async (reviewData) => {
    await reviewService.create(productId, reviewData)
    await loadReviewData()
  }

  // UPDATE
  const handleUpdateReview = async (reviewData) => {
    if (!userReview) return
    await reviewService.update(userReview.id, reviewData)
    setIsEditing(false)
    await loadReviewData()
  }

  // DELETE
  const handleDeleteReview = async () => {
    if (!userReview) return
    await reviewService.deleteOne(userReview.id)
    setConfirmDelete(false)
    setIsEditing(false)
    await loadReviewData()
  }

  const handleEditClick = () => {
    setConfirmDelete(false)
    setIsEditing(true)
  }

  if (loading) {
    return <div style={{ padding: '40px' }}>Loading reviews...</div>
  }

  return (
    <div style={{ marginTop: '40px', borderTop: '2px solid #E5E7EB', paddingTop: '40px' }}>
      <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '24px' }}>
        Customer Reviews
      </h2>

      <ReviewStats stats={stats} />

      {/* ================= USER REVIEW SECTION ================= */}
      {user ? (
        <>
          {userReview ? (
            isEditing ? (
              <ReviewForm
                productId={productId}
                existingReview={userReview}
                onSubmit={handleUpdateReview}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <div
                style={{
                  padding: '20px',
                  backgroundColor: '#EFF6FF',
                  border: '2px solid #3B82F6',
                  borderRadius: '8px',
                  marginBottom: '24px'
                }}
              >
                <h4 style={{ marginBottom: '12px', fontWeight: '600' }}>
                  Your Review
                </h4>

                <StarRating rating={userReview.rating} size="medium" />

                {userReview.comment && (
                  <p style={{ marginTop: '12px', color: '#374151', lineHeight: '1.6' }}>
                    {userReview.comment}
                  </p>
                )}

                {/* ---------- INLINE DELETE CONFIRMATION ---------- */}
                <div style={{ marginTop: '16px' }}>
                  {!confirmDelete ? (
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        onClick={handleEditClick}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#3B82F6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '500'
                        }}
                      >
                        Edit Review
                      </button>

                      <button
                        onClick={() => setConfirmDelete(true)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#EF4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '500'
                        }}
                      >
                        Delete Review
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{
                        marginTop: '12px',
                        padding: '12px',
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FCA5A5',
                        borderRadius: '6px'
                      }}
                    >
                      <p style={{ margin: '0 0 12px 0', color: '#991B1B' }}>
                        Are you sure you want to delete this review?
                      </p>

                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          onClick={handleDeleteReview}
                          style={{
                            padding: '6px 14px',
                            backgroundColor: '#DC2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                        >
                          Yes, delete
                        </button>

                        <button
                          onClick={() => setConfirmDelete(false)}
                          style={{
                            padding: '6px 14px',
                            backgroundColor: '#E5E7EB',
                            color: '#374151',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          ) : (
            <ReviewForm
              productId={productId}
              existingReview={null}
              onSubmit={handleCreateReview}
            />
          )}
        </>
      ) : (
        <div
          style={{
            padding: '20px',
            backgroundColor: '#FEF3C7',
            border: '1px solid #FBBF24',
            borderRadius: '8px',
            marginBottom: '24px'
          }}
        >
          <p style={{ margin: 0, color: '#92400E' }}>
            Please log in to write a review
          </p>
        </div>
      )}

      {/* ================= ALL REVIEWS ================= */}
      <ReviewList
        reviews={reviews}
        currentUserId={userId}
        onEditReview={handleEditClick}
        onDeleteReview={() => setConfirmDelete(true)}
      />
    </div>
  )
}

export default ReviewSection