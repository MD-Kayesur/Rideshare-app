import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { setUser, logout } from '../redux/features/auth/authSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = !!user;

  const signIn = async (email?: string, password?: string) => {
    // Implement your sign in logic
    dispatch(setUser({ user: { email: email || 'user@example.com' }, token: 'mock-token' }));
  };

  const signUp = async (email?: string, password?: string) => {
    // Implement your sign up logic
    dispatch(setUser({ user: { email: email || 'user@example.com' }, token: 'mock-token' }));
  };

  const signOut = () => {
    dispatch(logout());
  };

  return {
    user,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
  };
}
