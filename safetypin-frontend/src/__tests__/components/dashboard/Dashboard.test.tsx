import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../../../components/dashboard/Dashboard';
import { AuthProvider } from '../../../components/auth/AuthContext';

// Mock the navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderDashboardWithRouter = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dashboard header', () => {
    renderDashboardWithRouter();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders all stat cards', () => {
    renderDashboardWithRouter();
    
    // Check for all stat cards
    expect(screen.getByText('Total Servers')).toBeInTheDocument();
    expect(screen.getByText('Files Uploaded')).toBeInTheDocument();
    expect(screen.getByText('Files Downloaded')).toBeInTheDocument();
    expect(screen.getByText('Active Transfers')).toBeInTheDocument();
  });

  it('renders server status section', () => {
    renderDashboardWithRouter();
    
    expect(screen.getByText('Server Status')).toBeInTheDocument();
    expect(screen.getByText('Add Server')).toBeInTheDocument();
  });

  it('renders recent transfers section', () => {
    renderDashboardWithRouter();
    
    expect(screen.getByText('Recent Transfers')).toBeInTheDocument();
    expect(screen.getByText('View All')).toBeInTheDocument();
  });

  it('has server items with storage usage indicators', () => {
    renderDashboardWithRouter();
    
    // Look for specific server names
    expect(screen.getByText('Production Server')).toBeInTheDocument();
    expect(screen.getByText('Development Server')).toBeInTheDocument();
    
    // Check for storage usage percentages
    expect(screen.getByText('85% used')).toBeInTheDocument();
    expect(screen.getByText('42% used')).toBeInTheDocument();
  });

  it('shows status chips on server cards', () => {
    renderDashboardWithRouter();
    
    // Look for specific status chips
    expect(screen.getAllByText('Online').length).toBeGreaterThan(0);
    expect(screen.getByText('Offline')).toBeInTheDocument();
  });

  it('renders recent file transfers with correct icons', () => {
    renderDashboardWithRouter();
    
    // Check for file names
    expect(screen.getByText('quarterly-report.pdf')).toBeInTheDocument();
    expect(screen.getByText('client-data.csv')).toBeInTheDocument();
    
    // Check for transfer direction chips
    expect(screen.getAllByText('Upload').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Download').length).toBeGreaterThan(0);
  });
});
