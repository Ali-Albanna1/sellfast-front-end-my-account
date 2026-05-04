import axios from 'axios'

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/bookings`

const create = async (bookingData) => {
  try {

    const token = localStorage.getItem('token')
    const response = await axios.post(BASE_URL, bookingData, {headers: {Authorization: `Bearer ${token}`}})
    return response.data

  } catch (error) {
    console.error(error)
    throw error
  }
}

const myBookings = async () => {
  try {

    const token = localStorage.getItem('token')
    const response = await axios.get(`${BASE_URL}/me`, {headers: { Authorization: `Bearer ${token}` }})
    return response.data
    
  } catch (error) {
    console.error(error)
  }
}

const show = async () => {
  try {

    const token = localStorage.getItem('token')
    const response = await axios.get(BASE_URL, {headers: { Authorization: `Bearer ${token}` }})
    return response.data
    
  } catch (error) {
    console.error(error)
  }
}

const update = async (id, status) => {
  try {

    const token = localStorage.getItem('token')
    const response = await axios.put(`${BASE_URL}/${id}/status`,{ status }, { headers: { Authorization: `Bearer ${token}` } })
    return response.data
    
  } catch (error) {
    console.error(error)
  }
}

export {
  create,
  myBookings,
  show,
  update
}
