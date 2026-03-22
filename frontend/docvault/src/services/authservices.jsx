import axiosInstance from "../utilis/axiosinstance";



export const registerUser = async (formData) => {

  try {

    const response = await axiosInstance.post(
      "/users/register",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    return response.data;

  } catch (error) {

    throw error.response?.data || error;

  }
};

export const loginUser = async (data) => {
  const response = await axiosInstance.post("/users/login", data);
  return response.data;
};


export const logoutUser = async () => {
  try {

    const response = await axiosInstance.post("/users/logout");

    return response.data;

  } catch (error) {

    throw error.response?.data || error;

  }
};




export const getCurrentUser = async () => {
  const res = await axiosInstance.get("/users/me");
  return res.data;
};

export const updateCurrentUser = async (formData) => {
  const response = await axiosInstance.patch("/users/me", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data;
};

