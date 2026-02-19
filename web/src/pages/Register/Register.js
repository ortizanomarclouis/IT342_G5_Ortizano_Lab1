import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: ''
    });
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.register(formData);
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Create Account</h2>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            minLength="3"
                            placeholder="Enter username"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="6"
                            placeholder="Enter password (min 6 characters)"
                        />
                    </div>

                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            placeholder="Enter first name"
                        />
                    </div>

                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            placeholder="Enter last name"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <p className="link-text">
                    Already have an account?{' '}
                    <span onClick={() => navigate('/login')} className="link">
                        Login here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;
