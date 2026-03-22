import axiosInstance from "../utilis/axiosinstance";

export const getMyFamily = async () => {
  const res = await axiosInstance.get("/families/myfamily");
  return res.data;
};

export const createFamily = async (familyname) => {
  try {
    const res = await axiosInstance.post("/families/create", { familyname });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const joinFamily = async (inviteCode) => {
  try {
    const res = await axiosInstance.post("/families/join", { inviteCode });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const addMemberToFamily = async (data) => {
  const res = await axiosInstance.post("/families/addmember", data);
  return res.data;
};

export const removeMemberFromFamily = async (memberId) => {
  const res = await axiosInstance.delete(`/families/removemember/${memberId}`);
  return res.data;
};
