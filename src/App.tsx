import React, { useState } from 'react';
import { Layout } from './components/templates/Layout';
import { Dashboard } from './pages/Dashboard';
import { TestsPage } from './pages/TestsPage';
import { TakeTestPage } from './pages/TakeTestPage';
import { CreateTestPage } from './pages/CreateTestPage';
import { QuestionsPage } from './pages/QuestionsPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onPageChange={setCurrentPage} />;
      case 'tests':
        return <TestsPage onPageChange={setCurrentPage} />;
      case 'take-test':
        return <TakeTestPage onPageChange={setCurrentPage} />;
      case 'create-test':
        return <CreateTestPage onPageChange={setCurrentPage} />;
      case 'questions':
        return <QuestionsPage onPageChange={setCurrentPage} />;
      case 'subjects':
        return <SubjectsPage onPageChange={setCurrentPage} />;
      case 'analytics':
        return <AnalyticsPage onPageChange={setCurrentPage} />;
      default:
        return <Dashboard onPageChange={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;