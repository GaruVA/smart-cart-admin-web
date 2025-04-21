import React, { useState } from 'react';
import SessionsList from '../components/sessions/SessionsList';
import SessionDetail from '../components/sessions/SessionDetail';
import '../styles/sessions.css';
import AdminLayout from '../layouts/AdminLayout';

const SessionsPage = () => {
  const [view, setView] = useState('list'); // 'list' or 'detail'
  const [selectedSessionId, setSelectedSessionId] = useState(null);

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
        onViewDetail={(id) => handleViewChange('detail', id)}
        onAddNew={null}
        onEditSession={null}
        onDeleteSession={null}
      />
    );
  };

  return (
    <AdminLayout>
      <div className="sessions-page">
        <div className="page-header">
          <h1>Sessions Management</h1>
        </div>
        {renderView()}
      </div>
    </AdminLayout>
  );
};

export default SessionsPage;