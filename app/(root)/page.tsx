import { getCurrentUser, isAuthenticated } from '@/lib/actions/auth.action'
import LandingPage from '@/components/LandingPage'
import AuthenticatedHomePage from '@/components/AuthenticatedHomePage'

const Page = async () => {
  const userAuthenticated = await isAuthenticated();
  
  return userAuthenticated ? <AuthenticatedHomePage /> : <LandingPage />;
};

export default Page;