import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNavigate } from 'react-router';
import { API_URL } from '../../../config';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Dumbbell,
  Users,
  TrendingUp,
  Plus,
  Search,
  MoreVertical,
  Calendar,
  UserCheck,
  UserX,
  LogOut
} from 'lucide-react';


const DashboardPage = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    membershipType: 'Monthly',
    image: null
  });

  const [members, setMembers] = useState([]);

  // Fetch members from API
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    const fetchMembers = async () => {
      try {
        setFetchError(null);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/posts`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Map database model to member model
        const mappedMembers = response.data.posts.map(post => {
          let amount = 1500;
          if (post.planName?.toLowerCase() === 'yearly') amount = 15000;
          if (post.planName?.toLowerCase() === 'quarterly') amount = 4000;

          return {
            id: post._id,
            name: post.name,
            email: post.email,
            phone: post.mobileNumber,
            joinDate: post.dateOfJoin ? new Date(post.dateOfJoin).toISOString().split('T')[0] : 'N/A',
            expiryDate: post.expiryDate ? new Date(post.expiryDate).toISOString().split('T')[0] : 'N/A',
            membershipType: post.planName,
            amount: amount,
            status: post.expiryDate && new Date(post.expiryDate) < new Date() ? 'expired' : 'active',
            lastPayment: post.dateOfJoin ? new Date(post.dateOfJoin).toISOString().split('T')[0] : 'N/A',
            imgUrl: post.imgUrl
          };
        });
        setMembers(mappedMembers);
      } catch (error) {
        console.error("Error fetching members:", error);
        setFetchError(error.response?.data?.message || error.message);
      } finally {
        setLoadingDashboard(false);
      }
    };

    if (user) {
      fetchMembers();
    }
  }, [user, authLoading, navigate]);

  // Dynamically calculate earnings data from members list
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const earningsData = monthNames.map((month, index) => {
    const monthEarnings = members
      .filter(member => {
        const joinDate = new Date(member.joinDate);
        return !isNaN(joinDate) && joinDate.getMonth() === index;
      })
      .reduce((sum, member) => sum + member.amount, 0);
    
    return { month, earnings: monthEarnings };
  });

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || member.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const totalEarnings = members.reduce((sum, member) => sum + member.amount, 0);
  const activeMembers = members.filter(m => m.status === 'active').length;
  const unpaidMembers = members.filter(m => m.status === 'unpaid').length;
  const totalMembers = members.length;

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMember.image) {
      alert("Please select an image for the member.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newMember.name);
      formData.append("email", newMember.email);
      formData.append("mobileNumber", newMember.phone);
      formData.append("planName", newMember.membershipType);
      formData.append("chacha", newMember.image);

      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const post = response.data.post;
      let amount = 1500;
      if (post.planName?.toLowerCase() === 'yearly') amount = 15000;
      if (post.planName?.toLowerCase() === 'quarterly') amount = 4000;

      const mappedMember = {
        id: post._id,
        name: post.name,
        email: post.email,
        phone: post.mobileNumber,
        joinDate: post.dateOfJoin ? new Date(post.dateOfJoin).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        expiryDate: post.expiryDate ? new Date(post.expiryDate).toISOString().split('T')[0] : 'N/A',
        membershipType: post.planName,
        amount,
        status: 'active',
        lastPayment: post.dateOfJoin ? new Date(post.dateOfJoin).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        imgUrl: post.imgUrl
      };

      setMembers([mappedMember, ...members]);
      setNewMember({ name: '', email: '', phone: '', membershipType: 'Monthly', image: null });
      setShowAddMember(false);
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Failed to add member. " + (error.response?.data?.message || ""));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (authLoading || (user && loadingDashboard)) return <div className="p-8 text-center text-neutral-400">Loading Dashboard...</div>;
  if (!user) return null;

  return (
    <div className="dashboard-wrapper">
      {/* Navigation */}
      <nav className="dashboard-nav">
        <div className="nav-container">
          <div className="nav-content">
            <div className="nav-logo">
              <Dumbbell className="logo-icon" />
              <span className="logo-text">Apna Member</span>
            </div>
            <div className="nav-actions">
              <span className="welcome-text">Welcome, {user?.username || user?.name || "Admin"}</span>
              <button onClick={logout} className="logout-btn">
                <LogOut className="h-4 w-4 mr-1.5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="dashboard-main">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card earnings">
            <div className="icon-box">
              <TrendingUp />
            </div>
            <div className="stat-info">
              <p className="label">Total Earnings</p>
              <p className="value">{formatCurrency(totalEarnings)}</p>
            </div>
          </div>

          <div className="stat-card members">
            <div className="icon-box">
              <Users />
            </div>
            <div className="stat-info">
              <p className="label">Total Members</p>
              <p className="value">{totalMembers}</p>
            </div>
          </div>

          <div className="stat-card active">
            <div className="icon-box">
              <UserCheck />
            </div>
            <div className="stat-info">
              <p className="label">Active Members</p>
              <p className="value">{activeMembers}</p>
            </div>
          </div>

          <div className="stat-card unpaid">
            <div className="icon-box">
              <UserX />
            </div>
            <div className="stat-info">
              <p className="label">Unpaid Members</p>
              <p className="value">{unpaidMembers}</p>
            </div>
          </div>
        </div>

        {/* Earnings Chart */}
        <div className="chart-section">
          <div className="section-header">
            <h2>Earnings Overview</h2>
            <div className="timeframe">
              <Calendar className="h-4 w-4" />
              <span>Last 12 Months</span>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 13 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 13 }} tickFormatter={(value) => value} />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), 'Earnings']}
                  contentStyle={{ borderRadius: '12px', background: '#171717', border: '1px solid #262626', color: '#fff' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#1e3a8a', strokeWidth: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Member Management */}
        <div className="member-management-section">
          <div className="management-header">
            <h2>Member<br />Management</h2>
            <button onClick={() => setShowAddMember(true)} className="btn-add">
              <Plus className="h-5 w-5 mr-2" />
              Add Member
            </button>
          </div>

          {/* Search bar space */}
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            <button
              onClick={() => setActiveTab('all')}
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            >
              All Members
            </button>
            <button
              onClick={() => setActiveTab('unpaid')}
              className={`tab-btn ${activeTab === 'unpaid' ? 'active' : ''}`}
            >
              Unpaid Members
            </button>
            <button
              onClick={() => setActiveTab('expired')}
              className={`tab-btn ${activeTab === 'expired' ? 'active' : ''}`}
            >
              Expired Members
            </button>
          </div>

          {/* List Headers */}
          <div className="list-header">
            <span>Member</span>
            <span>Contact</span>
          </div>

          {/* Member List */}
          <div className="member-list">
            {fetchError ? (
              <div className="p-8 text-center text-red-400 bg-red-900/10 rounded-xl border border-red-900/30">
                <p className="font-medium">Error loading members</p>
                <p className="text-sm opacity-80">{fetchError}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 px-4 py-2 bg-red-900/20 hover:bg-red-900/40 border border-red-900/40 rounded-lg text-sm transition-all"
                >
                  Retry Connection
                </button>
              </div>
            ) : filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <div key={member.id} className="member-item">
                  <div className="member-info">
                    <div className="avatar">
                      {member.imgUrl ? (
                        <img src={member.imgUrl} alt={member.name} />
                      ) : (
                        <div className="placeholder">{member.name.charAt(0)}</div>
                      )}
                    </div>
                    <div>
                      <h4 className="name">{member.name}</h4>
                      <p className="date">Joined {member.joinDate} • <span className={member.status === 'expired' ? 'text-red-500' : 'text-green-500'}>Expires {member.expiryDate}</span></p>
                    </div>
                  </div>
                  <div className="contact-info">
                    <p className="email">{member.email}</p>
                    <p className="phone">{member.phone}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">No members found matching your search.</div>
            )}
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Add New Member</h3>
              <button onClick={() => setShowAddMember(false)} className="btn-close">&times;</button>
            </div>

            <form onSubmit={handleAddMember} className="modal-form">
              <div className="form-group">
                <label>Full Name <span>*</span></label>
                <input
                  type="text"
                  required
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Email <span>*</span></label>
                  <input
                    type="email"
                    required
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    placeholder="name@email.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone <span>*</span></label>
                  <input
                    type="tel"
                    required
                    value={newMember.phone}
                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                    placeholder="+91 xxxxx xxxxx"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Membership Type <span>*</span></label>
                <select
                  value={newMember.membershipType}
                  onChange={(e) => setNewMember({ ...newMember, membershipType: e.target.value })}
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>

              <div className="form-group">
                <label>Profile Image <span>*</span></label>
                <div className="image-upload-box" onClick={() => document.getElementById('file-upload').click()}>
                  <div className="upload-content">
                    <div className="upload-icon"><Plus className="h-full w-full" /></div>
                    <div className="upload-text">
                      <span>{newMember.image ? newMember.image.name : "Click to upload member photo"}</span>
                      <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={(e) => setNewMember({ ...newMember, image: e.target.files[0] })} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowAddMember(false)} className="btn-cancel">Cancel</button>
                <button type="submit" className="btn-save">Save Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
