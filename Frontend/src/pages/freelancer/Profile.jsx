import React, { useEffect, useState } from 'react';
import "./Profile.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router';

const Profile = () => {
    const { id } = useParams();
    const [user, setUser] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        country: '',
        desc: '',
        occupation: '',
        skills: '',
        certificates: '',
        experiences: '',
        languages: ''
    });
    const [averageRating, setAverageRating] = useState(0);
    const [rating, setRating] = useState(0);

    // Fetch current user data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                let res;
                const token = localStorage.getItem("token");  // Get token from localStorage
                
                if (id) {
                    // Fetch freelancer data
                    res = await axios.get(`http://localhost:5000/api/users/get-freelancerByid/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },  // Add the token in the headers
                        withCredentials: true
                    });
                    setUser(res.data.freelancer);
                } else {
                    // Fetch current user data
                    res = await axios.get("http://localhost:5000/api/users/get-current-user", {
                        headers: { Authorization: `Bearer ${token}` },  // Add the token in the headers
                        withCredentials: true
                    });
                    setUser(res.data);
                }
        
                setFormData({
                    username: res.data.username || '',
                    email: res.data.email || '',
                    country: res.data.country || '',
                    desc: res.data.desc || '',
                    occupation: res.data.occupation || '',
                    skills: res.data.skills.join(", ") || '',
                    certificates: res.data.certificates.join(", ") || '',
                    experiences: res.data.experiences.join(", ") || '',
                    languages: res.data.languages.join(", ") || ''
                });
            } catch (err) {
                console.error("Error fetching profile:", err);
            }
        };
        
        fetchProfile();
    }, [id]); // Re-run when `id` changes
    
    useEffect(() => {
        const fetchRating = async () => {
            try {
                if (user._id) {
                    const token = localStorage.getItem("token");
                    const res = await axios.get(`http://localhost:5000/api/ratings/avg/${user._id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true,
                    });
                    const avgRating = res.data.averageRating || 0;
                    setAverageRating(avgRating);
                    // Save average rating in localStorage
                    localStorage.setItem('averageRating', avgRating);
                }
            } catch (err) {
                console.error("Error fetching average rating:", err);
            }
        };
        if (user._id) {
            fetchRating();
        }
    }, [user._id]); // Only refetch if user._id changes
    
    useEffect(() => {
        const savedRatings = JSON.parse(localStorage.getItem('ratings')) || {};
        if (user._id && savedRatings[user._id]) {
            setRating(Number(savedRatings[user._id]));
        }
    }, [user._id]);
    
    
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        return (
            <>
                {[...Array(fullStars)].map((_, i) => (
                    <i key={`full-${i}`} className="fas fa-star text-warning"></i>
                ))}
                {halfStar && <i className="fas fa-star-half-alt text-warning"></i>}
                {[...Array(emptyStars)].map((_, i) => (
                    <i key={`empty-${i}`} className="far fa-star text-warning"></i>
                ))}
            </>
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
    
            const updatedFormData = {
                ...formData,
                // Ensure skills, certificates, experiences, languages are sent as arrays
                skills: formData.skills.split(",").map(skill => skill.trim()),
                certificates: formData.certificates.split(",").map(cert => cert.trim()),
                experiences: formData.experiences.split(",").map(exp => exp.trim()),
                languages: formData.languages.split(",").map(lang => lang.trim())
            };
    
            // Send the updated data to the backend
            const res = await axios.put("http://localhost:5000/api/users/update-userProfile", updatedFormData, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
    
            if (res.data) {
                console.log("Profile updated successfully:", res.data);
                setUser(res.data);  // Update the user state with the response data
                setEditMode(false);  // Exit edit mode
    
                // Update formData with the newly updated user data
                setFormData({
                    username: res.data.username,
                    email: res.data.email,
                    country: res.data.country,
                    desc: res.data.desc,
                    occupation: res.data.occupation,
                    skills: res.data.skills.join(", "),
                    certificates: res.data.certificates.join(", "),
                    experiences: res.data.experiences.join(", "),
                    languages: res.data.languages.join(", ")
                });
            } else {
                console.error("Failed to update the profile. No response data.");
            }
        } catch (err) {
            console.error("Error updating profile:", err);
        }
    };
    
    const handleRatingSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                `http://localhost:5000/api/ratings/rate/${user._id}`,
                { stars: rating },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );
    
            alert("Rating submitted successfully!");
    
            const updatedRatings = JSON.parse(localStorage.getItem('ratings')) || {};
            const updatedAverageRatings = JSON.parse(localStorage.getItem('averageRatings')) || {};
    
            updatedRatings[user._id] = rating;
            updatedAverageRatings[user._id] = res.data.averageStars;
    
            localStorage.setItem('ratings', JSON.stringify(updatedRatings));
            localStorage.setItem('averageRatings', JSON.stringify(updatedAverageRatings));
    
            setAverageRating(res.data.averageStars);
    
        } catch (err) {
            console.error("Error submitting rating:", err);
            alert("There was an issue submitting your rating.");
        }
    };
    
    

    useEffect(() => {
        const savedAverageRatings = JSON.parse(localStorage.getItem('averageRatings')) || {};
        if (user._id && savedAverageRatings[user._id]) {
            setAverageRating(Number(savedAverageRatings[user._id]));
        }
    }, [user._id]);
    
    

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };
    
    return (
        <section className="section about-section gray-bg" id="about">
            <div className="container">
                {console.log("Rendering the Edit button")}

                {/* Edit Button */}
                <div className="button-container">
                    <button
                        className="btn btn-light"
                        onClick={() => {
                            setEditMode(!editMode);
                            console.log("Edit Mode Toggled:", !editMode);
                        }}
                        title="Edit Profile"
                    >
                        <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                </div>


                {/* Profile Content */}
                <div className="row align-items-center flex-row-reverse">
                    <div className="col-lg-6">
                        <div className="about-text go-to">
                            {/* Profile Form (Edit mode) */}
                            {editMode ? (
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Country</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea
                                            className="form-control"
                                            name="desc"
                                            value={formData.desc}
                                            onChange={handleChange}
                                            rows="4"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Occupation</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="occupation"
                                            value={formData.occupation}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Skills</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="skills"
                                            value={formData.skills}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Certificates</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="certificates"
                                            value={formData.certificates}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Experiences</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="experiences"
                                            value={formData.experiences}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Languages</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="languages"
                                            value={formData.languages}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        Save Changes
                                    </button>
                                </form>
                            ) : (
                                // Profile View (Read-only mode)
                                <>
                                    <h3 className="dark-color">{user.username}</h3>
                                    <h6 className="theme-color lead">{user.occupation}</h6>
                                    <div className="mb-3">
                                        {renderStars(rating)}
                                        <span className="ms-2 text-muted">({rating.toFixed(1)} / 5)</span>
                                    </div>
                                    {/* Rating Section */}
                                    <div className="rating-section">
                                        <h5>Rate this Freelancer</h5>
                                        <div className="stars">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <i
                                                    key={star}
                                                    className={`fa-star ${star <= rating ? 'fas' : 'far'}`}
                                                    onClick={() => handleRatingChange(star)}
                                                />
                                            ))}
                                        </div>
                                        <button onClick={handleRatingSubmit} className="btn btn-primary">
                                            Submit Rating
                                        </button>
                                    </div>
                                    <p>{user.desc}</p>
                                    <div className="row about-list">
                                        <div className="col-md-6">
                                            <div className="media">
                                                <label>Email</label>
                                                <p>{user.email}</p>
                                            </div>
                                            <div className="media">
                                                <label>Residence</label>
                                                <p>{user.country}</p>
                                            </div>
                                            <div className="media">
                                                <label>Skills</label>
                                                <p>
                                                    {Array.isArray(user.skills) && user.skills.length > 0
                                                        ? user.skills.join(", ")
                                                        : "Not Available"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="media">
                                                <label>Certificates</label>
                                                <p>
                                                    {Array.isArray(user.certificates) && user.certificates.length > 0
                                                        ? user.certificates.join(", ")
                                                        : "Not Available"}
                                                </p>
                                            </div>
                                            <div className="media">
                                                <label>Experiences</label>
                                                <p>
                                                    {Array.isArray(user.experiences) && user.experiences.length > 0
                                                        ? user.experiences.join(", ")
                                                        : "Not Available"}
                                                </p>
                                            </div>
                                            <div className="media">
                                                <label>Languages</label>
                                                <p>
                                                    {Array.isArray(user.languages) && user.languages.length > 0
                                                        ? user.languages.join(", ")
                                                        : "Not Available"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="about-avatar">
                            <img src={`http://localhost:5000${user.img}`} title="" alt="" />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

export default Profile;
