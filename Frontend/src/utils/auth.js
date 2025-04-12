/*import jwtDecode from "jwt-decode";

export const getCurrentUser = () => {
    try {
      const token = localStorage.getItem("token"); // or "accessToken"
      if (!token) return null;
  
      const decoded = jwtDecode(token);
      return {
        userId: decoded.id || decoded._id, // depending on your backend
        username: decoded.username ,
        role: decoded.role,
      };
    } catch (error) {
      return null;
    }
  };*/