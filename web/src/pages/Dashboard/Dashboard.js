import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = authService.getToken();
            
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const userData = await authService.getUserProfile();
                setUser(userData);
            } catch (err) {
                setError('Failed to load user profile');
                if (err.response?.status === 401) {
                    authService.logout();
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <div className="error">{error}</div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </div>

            <div className="profile-section">
                <div className="profile-card">
                    <div className="profile-avatar">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </div>
                    
                    <h2>Profile Information</h2>
                    
                    <div className="profile-info">
                        <div className="info-row">
                            <span className="label">User ID:</span>
                            <span className="value">{user?.userId}</span>
                        </div>
                        
                        <div className="info-row">
                            <span className="label">Username:</span>
                            <span className="value">{user?.username}</span>
                        </div>
                        
                        <div className="info-row">
                            <span className="label">First Name:</span>
                            <span className="value">{user?.firstName}</span>
                        </div>
                        
                        <div className="info-row">
                            <span className="label">Last Name:</span>
                            <span className="value">{user?.lastName}</span>
                        </div>
                        
                        <div className="info-row">
                            <span className="label">Account Created:</span>
                            <span className="value">
                                {user?.createAt ? new Date(user.createAt).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                        
                        <div className="info-row">
                            <span className="label">Last Login:</span>
                            <span className="value">
                                {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;