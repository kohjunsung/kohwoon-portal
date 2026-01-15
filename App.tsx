import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import Payments from './components/Payments';
import Files from './components/Files';
import Settings from './components/Settings';
import ClientManagement from './components/ClientManagement';
import Footer from './components/Footer';
import Login from './Login';
import { User, Client } from './types';
import { db } from './services/mockData';

const MainLayout: React.FC<{ onLogout: () => void; user: User }> = ({ onLogout, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname.substring(1) || 'dashboard';
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // App-level state for Clients to ensure immediate UI updates across Sidebar and Management pages
  const [clients, setClients] = useState<Client[]>(db.getClients());
  
  // Client Context State
  // Default to user's own ID, or the first client if Admin
  const [selectedClientId, setSelectedClientId] = useState<string>(
    user.role === 'admin' ? (db.getClients()[0]?.id || '') : user.id
  );

  const refreshClients = () => {
    setClients(db.getClients());
  };

  return (
    <div className="flex min-h-screen bg-white font-sans text-gray-900">
      <Sidebar 
        activeTab={currentTab} 
        onNavigate={(tab) => navigate(`/${tab}`)} 
        user={user}
        onLogout={onLogout}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        selectedClientId={selectedClientId}
        onClientChange={setSelectedClientId}
        clients={clients} // Pass dynamic clients list
      />
      
      <div className="flex-1 lg:ml-72 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white h-16 border-b border-gray-100 flex items-center px-4 justify-between flex-none z-30 relative">
            <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold">K+C</div>
                <span className="font-bold text-lg tracking-tight text-gray-900">Kohwoon Ad</span>
            </div>
            <button onClick={() => setIsMobileOpen(true)} className="p-2 text-gray-600">
                <Menu size={24} />
            </button>
        </div>

        <main className="flex-1 overflow-y-auto bg-white scroll-smooth">
            <div className="max-w-7xl mx-auto min-h-full flex flex-col p-6 md:p-10">
                <div className="flex-1">
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard user={user} selectedClientId={selectedClientId} />} />
                        <Route path="/reports" element={<Reports user={user} selectedClientId={selectedClientId} />} />
                        <Route path="/payments" element={<Payments user={user} />} />
                        <Route path="/files" element={<Files user={user} />} />
                        <Route path="/settings" element={<Settings user={user} />} />
                        {user.role === 'admin' && (
                            <>
                                <Route path="/clients" element={<ClientManagement user={user} type="client" onUpdate={refreshClients} />} />
                                {user.email === 'kwad@kohwoonc.com' && (
                                    <Route path="/admins" element={<ClientManagement user={user} type="admin" onUpdate={refreshClients} />} />
                                )}
                            </>
                        )}
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <HashRouter>
      {user ? (
        <MainLayout onLogout={handleLogout} user={user} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </HashRouter>
  );
};

export default App;