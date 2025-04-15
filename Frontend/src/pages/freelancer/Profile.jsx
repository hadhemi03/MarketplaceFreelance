import React, { useEffect, useState } from 'react';
import "./Profile.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Profile = () => {
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

    // Fetch current user data
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/api/users/get-current-user", {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });
                setUser(res.data);
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
                console.error(err);
            }
        };
        fetchCurrentUser();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submit for updating user profile
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:5000/api/users/update-user/${user._id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            setEditMode(false); // Switch back to view mode after submission
            setUser({ ...user, ...formData }); // Update user state with the new form data
        } catch (err) {
            console.error("Error updating user:", err);
        }
    };

    return (
        <section className="section about-section gray-bg" id="about">
            <div className="container">
                {/* Edit Button */}
                <div className="d-flex justify-content-end">
                    <button
                        className="btn btn-light"
                        onClick={() => setEditMode(!editMode)}
                        title="Edit Profile"
                    >
                        <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
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
                <div className="counter">
                    <div className="row">
                        <div className="col-6 col-lg-3">
                            <div className="count-data text-center">
                                <h6 className="count h2" data-to="500" data-speed="500">500</h6>
                                <p className="m-0px font-w-600">Happy Clients</p>
                            </div>
                        </div>
                        <div className="col-6 col-lg-3">
                            <div className="count-data text-center">
                                <h6 className="count h2" data-to="150" data-speed="150">150</h6>
                                <p className="m-0px font-w-600">Project Completed</p>
                            </div>
                        </div>
                        <div className="col-6 col-lg-3">
                            <div className="count-data text-center">
                                <h6 className="count h2" data-to="850" data-speed="850">850</h6>
                                <p className="m-0px font-w-600">Photo Capture</p>
                            </div>
                        </div>
                        <div className="col-6 col-lg-3">
                            <div className="count-data text-center">
                                <h6 className="count h2" data-to="190" data-speed="190">190</h6>
                                <p className="m-0px font-w-600">Telephonic Talk</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Profile;
