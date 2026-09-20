import * as React from 'react';

import { PageLoader } from '@/components/common/PageLoader';
import { AppRouter } from '@/routes/AppRouter';
import { useAuthStore } from '@/store/authStore';

const App: React.FC = () => {
  const { checkAuth, isCheckingAuth } = useAuthStore();

  React.useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <PageLoader label="Verifying session..." />;
  }

  return <AppRouter />;
};

export default App;
