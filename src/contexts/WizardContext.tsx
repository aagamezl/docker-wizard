import React, { createContext, useContext, useState, useCallback } from 'react';
import type { WizardState, WizardActions } from '../types';

const WizardContext = createContext<{
  state: WizardState;
  dispatch: (action: WizardActions) => void;
} | undefined>(undefined);

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};

export const WizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WizardState>({
    currentStep: 1,
    formData: {
      project: {
        name: '',
        baseImage: '',
      },
      docker: {
        ports: [],
        volumes: [],
        environmentVariables: '',
        workingDir: '',
        command: '',
        entrypoint: '',
        labels: '',
      },
      dockerCompose: {
        services: [],
      },
    },
  });

  const dispatch = useCallback((action: WizardActions) => {
    setState(prev => {
      switch (action.type) {
        case 'UPDATE_PROJECT_INFO':
          return { ...prev, formData: { ...prev.formData, project: action.payload } };
        case 'ADD_PORT':
          return { 
            ...prev, 
            formData: { 
              ...prev.formData, 
              docker: { 
                ...prev.formData.docker, 
                ports: [...prev.formData.docker.ports, action.payload] 
              } 
            } 
          };
        case 'REMOVE_PORT':
          return { 
            ...prev, 
            formData: { 
              ...prev.formData, 
              docker: { 
                ...prev.formData.docker, 
                ports: prev.formData.docker.ports.filter((_, index) => index !== action.payload)
              } 
            } 
          };
        // Add other cases for remaining actions
        default:
          return prev;
      }
    });
  }, []);

  return (
    <WizardContext.Provider value={{ state, dispatch }}>
      {children}
    </WizardContext.Provider>
  );
};
