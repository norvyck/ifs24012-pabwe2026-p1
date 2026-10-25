import { useEffect, useState } from 'react';
import ClaimDetail from './pages/ClaimDetail';
import ClaimList from './pages/ClaimList';
import AuthPage from './pages/AuthPage';
import MyClaims from './pages/MyClaims';
import MyEvidence from './pages/MyEvidence';
import MyVotes from './pages/MyVotes';
import PrivateGate from './pages/PrivateGate';
import Profile from './pages/Profile';
import SubmitClaim from './pages/SubmitClaim';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { useNavigation } from './hooks/useNavigation';
import { api } from './services/api';
import { clearSession, readSession, saveSession } from './utils/session';

const privatePages = ['/submit', '/dashboard', '/evidence', '/votes', '/profile'];

export default function App() {
  const { route, navigate } = useNavigation();
  const [user, setUser] = useState(readSession);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');
  const routePath = route.split('?')[0];

  useEffect(() => {
    let active = true;
    api('/api/claims')
      .then((result) => { if (active) setClaims(result.claims); })
      .catch((error) => { if (active) setListError(error.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [route]);

  function authenticateUser(response) {
    const session = { ...response.user, token: response.token };
    saveSession(session);
    setUser(session);
    const redirect = new URLSearchParams(window.location.search).get('redirect');
    const target = redirect?.startsWith('/') && !redirect.startsWith('//') ? redirect : '/';
    navigate(target);
  }

  function logout() {
    clearSession();
    setUser(null);
    navigate('/');
  }

  function requireLogin() {
    navigate(`/auth/login?redirect=${encodeURIComponent(route)}`);
  }

  const detail = routePath.match(/^\/claims\/(\d+)$/);
  const isPrivatePage = privatePages.includes(routePath);
  const page = detail ? (
    <ClaimDetail key={detail[1]} id={detail[1]} user={user} onRequireLogin={requireLogin} />
  ) : routePath === '/auth/login' || routePath === '/auth/register' ? (
    <AuthPage mode={routePath === '/auth/login' ? 'login' : 'register'} onAuthenticated={authenticateUser} />
  ) : isPrivatePage && !user ? (
    <PrivateGate route={route} />
  ) : routePath === '/submit' ? (
    <SubmitClaim user={user} />
  ) : routePath === '/dashboard' ? (
    <MyClaims user={user} />
  ) : routePath === '/evidence' ? (
    <MyEvidence user={user} />
  ) : routePath === '/votes' ? (
    <MyVotes user={user} />
  ) : routePath === '/profile' ? (
    <Profile user={user} />
  ) : (
    <ClaimList claims={claims} loading={loading} error={listError} user={user} />
  );

  return (
    <>
      <Header user={user} onLogout={logout} />
      {page}
      <Footer />
    </>
  );
}
