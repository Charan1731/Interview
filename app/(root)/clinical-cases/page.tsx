import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';
import ClinicalCasesDashboard from '@/components/ClinicalCasesDashboard';

const ClinicalCasesPage = async () => {
  const isUserAuthenticated = await isAuthenticated();

  if (!isUserAuthenticated) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-dark-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200 bg-clip-text text-transparent mb-4">
            Clinical Case Simulator
          </h1>
          <p className="text-light-100 text-lg">
            Practice your diagnostic skills with AI-generated patient cases
          </p>
        </div>
        
        <ClinicalCasesDashboard />
      </div>
    </div>
  );
};

export default ClinicalCasesPage;
