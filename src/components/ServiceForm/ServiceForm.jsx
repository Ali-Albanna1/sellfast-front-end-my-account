import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import * as serviceService from '../../services/serviceService'
import ImageUpload from '../ImageUpload/ImageUpload'
import styles from './ServiceForm.module.css'
import { toast } from 'react-toastify'

function ServiceForm({ user }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration_minutes: "",
    is_available: true,
    image: ""
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isEdit) {
      setLoading(false)
      return
    }

    const getService = async () => {
      try {
        const service = await serviceService.details(id)
        setFormData({
          ...service,
          price: String(service.price),
          duration_minutes: String(service.duration_minutes)
        })
        setLoading(false)
      } catch (error) {
        console.error(error)
        navigate('/services', { replace: true })
      }
    }

    getService()
  }, [id, isEdit, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()

    const payload = {
      ...formData,
      price: Number(formData.price),
      duration_minutes: Number(formData.duration_minutes)
    }

    try {
      if (isEdit) {
        await serviceService.update(id, payload)
        navigate(`/services/${id}`)
        toast.success("Service updated successfully!")
      } else {
        await serviceService.create(payload)
        navigate('/services')
        toast.success("Service created successfully!")
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    }
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  if (loading) return <p>Loading...</p>

  return (
    <main className={styles.serviceForm}>
      <section className={styles.formWrapper}>
        <h1>{isEdit ? 'Update Service' : 'Add a Service'}</h1>

        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.field}>
            <label htmlFor="name">Name:</label>
            <input 
              onChange={handleChange} 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              required 
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="description">Description:</label>
            <input 
              onChange={handleChange} 
              type="text" 
              id="description" 
              name="description" 
              value={formData.description} 
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="price">Price ($):</label>
            <input 
              onChange={handleChange} 
              type="number" 
              id="price" 
              name="price" 
              value={formData.price} 
              min="0"
              step="0.01"
              required 
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="duration_minutes">Duration (minutes):</label>
            <input 
              onChange={handleChange} 
              type="number" 
              id="duration_minutes" 
              name="duration_minutes" 
              value={formData.duration_minutes} 
              min="1"
              required 
            />
          </div>

          <div className={styles.checkboxField}>
            <input 
              onChange={handleChange} 
              type="checkbox" 
              id="is_available" 
              name="is_available" 
              checked={formData.is_available}
            />
            <label htmlFor="is_available">Available</label>
          </div>

          <div className={styles.imageUploadSection}>
            <label>Service Image:</label>
            <div className={styles.imageUploadWrapper}>
              <div className={styles.uploadIcon}>📷</div>
              <ImageUpload 
                onUpload={(url) => setFormData(prev => ({ ...prev, image: url }))}
              />
              <p className={styles.uploadText}>Upload a service image</p>
            </div>
          </div>

          {formData.image && (
            <div className={styles.imagePreview}>
              <span className={styles.imagePreviewLabel}>Preview:</span>
              <img src={formData.image} alt="Uploaded preview" />
            </div>
          )}

          <div className={styles.actions}>
            <button type="submit">
              {isEdit ? 'Update Service' : 'Add Service'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate(isEdit ? `/services/${id}` : '/services')}
            >
              Cancel
            </button>
          </div>

        </form>
      </section>
    </main>
  )
}

export default ServiceForm