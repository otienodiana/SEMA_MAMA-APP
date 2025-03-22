import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import MomDashboard from '../MomDashboard';

const MockMomDashboard = () => {
  return (
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <MomDashboard />
      </I18nextProvider>
    </BrowserRouter>
  );
};

describe('MomDashboard Component Tests', () => {
  beforeEach(() => {
    console.log('\nRunning test suite for MomDashboard component...');
  });

  afterEach(() => {
    console.log('Test completed.');
  });

  test('renders dashboard header', () => {
    console.log('Testing dashboard header rendering...');
    render(<MockMomDashboard />);
    const header = screen.getByText('Moms Dashboard');
    expect(header).toBeInTheDocument();
    console.log('✓ Dashboard header rendered successfully');
  });

  test('renders all navigation links', () => {
    console.log('Testing navigation links rendering...');
    render(<MockMomDashboard />);
    
    const navItems = [
      'dashboard.profile',
      'dashboard.community',
      'dashboard.resources',
      'dashboard.assessment',
      'dashboard.settings',
      'dashboard.appointments',
      'dashboard.logout'
    ];

    navItems.forEach(item => {
      const link = screen.getByText(item);
      expect(link).toBeInTheDocument();
      console.log(`✓ Navigation link "${item}" found`);
    });
  });

  test('dashboard container structure', () => {
    console.log('Testing dashboard container structure...');
    const { container } = render(<MockMomDashboard />);
    
    expect(container.querySelector('.mom-dashboard-container')).toBeInTheDocument();
    console.log('✓ Dashboard container exists');
    
    expect(container.querySelector('.mom-dashboard-nav')).toBeInTheDocument();
    console.log('✓ Navigation section exists');
    
    expect(container.querySelector('.mom-dashboard-content')).toBeInTheDocument();
    console.log('✓ Content section exists');
  });

  test('navigation link structure', () => {
    console.log('Testing navigation link structure...');
    const { container } = render(<MockMomDashboard />);
    const navLinks = container.querySelectorAll('.mom-dashboard-nav a');
    
    expect(navLinks.length).toBe(7);
    console.log(`✓ Found ${navLinks.length} navigation links`);
  });
});

// Add snapshot testing
describe('MomDashboard Snapshot Tests', () => {
  it('matches snapshot', () => {
    console.log('Testing component snapshot...');
    const { container } = render(<MockMomDashboard />);
    expect(container).toMatchSnapshot();
    console.log('✓ Snapshot matched successfully');
  });
});
