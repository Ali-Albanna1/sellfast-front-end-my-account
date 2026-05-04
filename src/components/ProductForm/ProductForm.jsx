// ProductForm.jsx

import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import * as productService from '../../services/productService'
import ImageUpload from '../ImageUpload/ImageUpload'
import styles from './ProductForm.module.css'
import { toast } from 'react-toastify'

function ProductForm({user}) {

  const navigate = useNavigate()
  const {id} = useParams()

  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    is_available: true,
    image: ""
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isEdit) {
      setLoading(false)
      return
    }

    const getProduct = async () => {
      try {
        const product = await productService.details(id)
        setFormData(product)
        setLoading(false)
      } catch (err) {
        console.log(err)
        navigate(`/products/${id}`, { replace: true })
      }
    }

    getProduct()

  },[id, isEdit, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()

    const payload = {...formData, price: Number(formData.price), stock: Number(formData.stock)}

    try {

      if (isEdit) {
        await productService.update(id, payload)
        navigate(`/products/${id}`)
        toast.success("Product updated successfully!")
      }
      else {
        await productService.create(payload)
        navigate("/products")
        toast.success("Product created successfully!")
      }
      
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    }

  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData({...formData, [name]: type === "checkbox" ? checked : value})
  }

  if (loading) return <p>Loading...</p>

  return (
    <main className={styles.productForm}>
      <section className={styles.formWrapper}>
        <h1>{isEdit ? 'Update Product' : 'Add a Product'}</h1>

        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.field}>
            <label htmlFor="name">Name:</label>
            <input onChange={handleChange} type="text" id='name' name='name' value={formData.name} required />
          </div>

          <div className={styles.field}>
            <label htmlFor="description">Description:</label>
            <input onChange={handleChange} type="text" id='description' name='description' value={formData.description} required />
          </div>

          <div className={styles.field}>
            <label htmlFor="price">Price:</label>
            <input onChange={handleChange} type="number" id='price' name='price' value={formData.price} required />
          </div>

          <div className={styles.field}>
            <label htmlFor="stock">Stock:</label>
            <input onChange={handleChange} type="number" id='stock' name='stock' value={formData.stock} required />
          </div>

          <div className={styles.checkboxField}>
            <input onChange={handleChange} type="checkbox" id='is_available' name='is_available' checked={formData.is_available} />
            <label htmlFor="is_available">Available</label>
          </div>

          <div className={styles.imageUploadSection}>
            <label>Product Image:</label>
            <div className={styles.imageUploadWrapper}>
              <div className={styles.uploadIcon}>📸</div>
              <ImageUpload
                onUpload={(url) =>
                  setFormData(prev => ({ ...prev, image: url }))
                }
              />
              <p className={styles.uploadText}>Upload a product image</p>
            </div>
          </div>

          {formData.image && (
            <div className={styles.imagePreview}>
              <span className={styles.imagePreviewLabel}>Preview:</span>
              <img src={formData.image} alt="Uploaded preview" />
            </div>
          )}

          <div className={styles.actions}>
            <button type="submit">{isEdit ? 'Update' : 'Add'}</button>
            <button type="button" onClick={() => navigate('/products')}>
              Cancel
            </button>
          </div>

        </form>
      </section>
    </main>
  )
}

export default ProductForm