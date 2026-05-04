import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/orders`

const show = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const create = async (orderData) => {
  try {
    const response = await axios.post(BASE_URL, orderData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

const getOne = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User is not logged in");

    const response = await axios.get(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch order:", error.response?.data || error.message);
    throw error;
  }
};

  const update = async (id, statusData) => {
    try {
      const token = localStorage.getItem("token")
      
      const response = await axios.put(`${BASE_URL}/${id}`, statusData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

export{
  show,
  create,
  getOne,
  update
}