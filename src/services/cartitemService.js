import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/cart-items`

const getCartItems = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


const deleteOne = async (id) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.delete(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const update = async (id, cartItem) => {
  try {

    const token = localStorage.getItem('token')
    const response = await axios.put(`${BASE_URL}/${id}`, cartItem, {headers: {Authorization: `Bearer ${token}`}})
    return response.data

  } catch (error) {
    console.error(error)
  }
}

const createCartItem = async (cartId, cartItem) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`${BASE_URL}/${cartId}`, cartItem, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.log(error.response?.data || error);
  }
};


export{
    getCartItems,
    deleteOne,
    update,
    createCartItem
}