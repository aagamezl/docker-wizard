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
      imageConfig: {
        labels: {},
        baseImage: '',
        shell: '',
        stopSignal: ''
      },
      buildProcess: {
        args: {},
        envVars: {},
        workdir: '',
        onBuild: '',
        healthCheck: '',
      },
      fileOperations: {
        copy: [],
        add: [],
        volume: [],
        id: '',
        sources: [],
        destination: ''
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

        case 'UPDATE_IMAGE_CONFIG':
          return { ...prev, formData: { ...prev.formData, imageConfig: action.payload } };

        case 'UPDATE_BUILD_PROCESS':
          return { ...prev, formData: { ...prev.formData, buildProcess: action.payload } };

        // case 'ADD_FILE_OPERATION':
        //   return {
        //     ...prev,
        //     formData: {
        //       ...prev.formData,
        //       buildProcess: {
        //         ...prev.formData.buildProcess,
        //         fileOperations: [
        //           ...prev.formData.buildProcess.fileOperations,
        //           action.payload
        //         ]
        //       }
        //     }
        //   };

        case 'UPDATE_FILE_OPERATION':
          return {
            ...prev,
            formData: {
              ...prev.formData,
              buildProcess: {
                ...prev.formData.buildProcess,
                fileOperations: prev.formData.buildProcess.fileOperations.map(op =>
                  op.id === action.payload.id ? action.payload : op
                )
              }
            }
          };

        // case 'REMOVE_FILE_OPERATION':
        //   return {
        //     ...prev,
        //     formData: {
        //       ...prev.formData,
        //       buildProcess: {
        //         ...prev.formData.buildProcess,
        //         fileOperations: prev.formData.buildProcess.fileOperations.filter(
        //           op => op.id !== action.payload
        //         )
        //       }
        //     }
        //   };

        // case 'ADD_PORT':
        //   return {
        //     ...prev,
        //     formData: {
        //       ...prev.formData,
        //       imageConfig: {
        //         ...prev.formData.imageConfig,
        //         ports: [...prev.formData.imageConfig.ports, action.payload]
        //       }
        //     }
        //   };
        // case 'REMOVE_PORT':
        //   return {
        //     ...prev,
        //     formData: {
        //       ...prev.formData,
        //       imageConfig: {
        //         ...prev.formData.imageConfig,
        //         ports: prev.formData.imageConfig.ports.filter((_, index) => index !== action.payload)
        //       }
        //     }
        //   };
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
