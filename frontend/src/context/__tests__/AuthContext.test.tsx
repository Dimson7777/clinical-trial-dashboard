import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../AuthContext';

const TestComponent = () => {
  const { isAuthenticated, user, logout } = useAuth();
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'unauthenticated'}</span>
      {user && <span data-testid="user-email">{user.email}</span>}
      <button onClick={logout}>Log Out</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('initializes as unauthenticated when no token is present', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(await screen.findByTestId('auth-status')).toHaveTextContent('unauthenticated');
  });

  it('restores authenticated state from valid stored token', async () => {
    localStorage.setItem('token', 'fake-jwt-token');
    localStorage.setItem('user', JSON.stringify({ email: 'researcher@trial.dev', full_name: 'Dr. Test' }));

    // Mock fetch for /api/auth/me
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ email: 'researcher@trial.dev', full_name: 'Dr. Test' }),
    } as Response);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(await screen.findByTestId('auth-status')).toHaveTextContent('authenticated');
    expect(screen.getByTestId('user-email')).toHaveTextContent('researcher@trial.dev');
  });

  it('logs out and clears storage', async () => {
    localStorage.setItem('token', 'fake-jwt-token');
    localStorage.setItem('user', JSON.stringify({ email: 'researcher@trial.dev', full_name: 'Dr. Test' }));

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ email: 'researcher@trial.dev', full_name: 'Dr. Test' }),
    } as Response);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(await screen.findByTestId('auth-status')).toHaveTextContent('authenticated');

    act(() => {
      screen.getByText('Log Out').click();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('unauthenticated');
    expect(localStorage.getItem('token')).toBeNull();
  });
});
