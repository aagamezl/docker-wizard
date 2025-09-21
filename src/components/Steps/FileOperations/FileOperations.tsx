
import React, { useState } from 'react';
import { useWizard } from '../../../contexts/WizardContext';
import FormSection from '../../FormSection/FormSection';
import { CopyList } from './CopyList';
// import styles from './BuildProcess.module.css';

// Re-export the CopyOperation type from CopyList
import type { CopyOperation } from './CopyList';

export const FileOperations = () => {
  const { state, dispatch } = useWizard();
  const [copies, setCopies] = useState<CopyOperation[]>([]);

  const handleAddCopy = (operation: Omit<CopyOperation, 'id'>) => {
    setCopies(prevCopies => [...prevCopies, { ...operation, id: Date.now().toString() }]);
  };

  const handleUpdateCopy = (id: string, operation: Omit<CopyOperation, 'id'>) => {
    setCopies(prevCopies => prevCopies.map(copy => 
      copy.id === id ? { ...operation, id } : copy
    ));
  };

  const handleRemoveCopy = (id: string) => {
    setCopies(prevCopies => prevCopies.filter(copy => copy.id !== id));
  };

  return (
    <>
      <FormSection title="File Operations" active={true}>
        <CopyList
          copies={copies}
          onAdd={handleAddCopy}
          onUpdate={handleUpdateCopy}
          onRemove={handleRemoveCopy}
        />
      </FormSection>
    </>
  );
};
