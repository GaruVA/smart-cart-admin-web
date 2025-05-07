import React, { useState, useEffect } from 'react';
import SessionsList from '../components/sessions/SessionsList';
import SessionDetail from '../components/sessions/SessionDetail';
import sessionsService from '../services/sessionsService';
import '../styles/sessions.css';
import AdminLayout from '../layouts/AdminLayout';

const SessionsPage = () => {
  const [view, setView] = useState('list'); // 'list' or 'detail'
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await sessionsService.getSessions();
      setSessions(response.data.sessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = async (sessionData) => {
    try {
      await sessionsService.createSession(sessionData);
      fetchSessions();
    } catch (error) {
      console.error('Error adding session:', error);
    }
  };

  const handleEditSession = async (id, sessionData) => {
    try {
      await sessionsService.updateSession(id, sessionData);
      fetchSessions();
    } catch (error) {
      console.error('Error editing session:', error);
    }
  };

  const handleDeleteSession = async (id) => {
    try {
      await sessionsService.deleteSession(id);
      fetchSessions();
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleViewChange = (newView, sessionId = null) => {
    setView(newView);
    if (sessionId !== null) setSelectedSessionId(sessionId);
  };

  const renderView = () => {
    if (view === 'detail') {
      return (
        <SessionDetail
          sessionId={selectedSessionId}
          onBack={() => handleViewChange('list')}
        />
      );
    }
    // default: list view
    return (
      <SessionsList
        sessions={sessions}
        loading={loading}
        onViewDetail={(id) => handleViewChange('detail', id)}
        onAddNew={handleAddNew}
        onEditSession={handleEditSession}
        onDeleteSession={handleDeleteSession}
      />
    );
  };

  return (
    <AdminLayout>
      <div className="sessions-page">
        <div className="page-header">
          <h1>Shopping Sessions</h1>
        </div>
        {renderView()}
      </div>
    </AdminLayout>
  );
};

export default SessionsPage;