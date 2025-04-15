import React, { useEffect, useState } from "react";
import axios from "axios";

const FreelancerModal = ({ onClose }) => {
    const [freelancers, setFreelancers] = useState([]);
    const [search, setSearch] = useState("");
  
    useEffect(() => {
      const fetchFreelancers = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get("http://localhost:5000/api/users/get-all-freelancers", {
              headers: { 
                  Authorization: `Bearer ${token}` 
              },
              withCredentials: true,
            });
  
          // Check if res.data is an array
          if (Array.isArray(res.data)) {
            setFreelancers(res.data);
          } else {
            console.error("Error: res.data is not an array", res.data);
          }
        } catch (err) {
          console.error("Failed to fetch freelancers", err);
        }
      };
  
      fetchFreelancers();
    }, []);
  
    const filteredFreelancers = freelancers.filter(f =>
      f.username.toLowerCase().includes(search.toLowerCase())
    );
  
    return (
      <div className="bg-light border rounded p-3 ms-2" style={{ width: "300px", height: "80vh", overflowY: "auto" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0">Select Freelancer</h6>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>×</button>
        </div>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search freelancer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {filteredFreelancers.length === 0 ? (
          <p className="text-muted">No freelancers found</p>
        ) : (
          filteredFreelancers.map(freelancer => (
            <div key={freelancer._id} className="d-flex align-items-center mb-2">
              <img
                src={`http://localhost:5000${freelancer.img}`}
                alt={freelancer.username}
                className="rounded-circle me-2"
                style={{ width: "35px", height: "35px" }}
              />
              <div>
                <strong>{freelancer.username}</strong>
                <div className="text-muted small">{freelancer.email}</div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };
  

export default FreelancerModal;
