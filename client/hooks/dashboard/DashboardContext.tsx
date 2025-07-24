import React, { createContext, useContext } from 'react';
import { useDashboardData } from './useDashboardData';

const DashboardContext = createContext<ReturnType<typeof useDashboardData> | null>(null);

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const dashboard = useDashboardData();
  return (
    <DashboardContext.Provider value={dashboard}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a <DashboardProvider>');
  }
  return context;
};
