import axiosInstance from "../utilis/axiosinstance";
// upload document
export const uploadDocument = async (memberId, formData) => {

  const response = await axiosInstance.post(
    `/documents/upload/${memberId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return response.data;
};


// get documents
export const getDocumentsByMember = async (memberId) => {

  const response = await axiosInstance.get(
    `/documents/member/${memberId}`
  );

  return response.data;
};


// delete document
export const deleteDocument = async (documentId) => {

  const response = await axiosInstance.delete(
    `/documents/${documentId}`
  );

  return response.data;
};

