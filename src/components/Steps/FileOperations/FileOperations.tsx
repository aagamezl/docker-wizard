
import { useWizard } from '../../../contexts/WizardContext';
import FormSection from '../../FormSection/FormSection';
import { CopyList } from './CopyList';

import type { CopyOperation } from '../../../types';

export const FileOperations = () => {
  const { state, dispatch } = useWizard();

  const handleAddCopy = (operation: Omit<CopyOperation, 'id'>) => {
    const newCopy: CopyOperation = {
      ...operation,
      id: `copy-${Date.now()}`,
    };

    const newCopyList = [...state.formData.fileOperations.copy, newCopy];

    dispatch({
      type: 'UPDATE_FILE_OPERATION',
      payload: {
        ...state.formData.fileOperations,
        copy: newCopyList,
      },
    });
  };

  const handleUpdateCopy = (id: string, operation: Omit<CopyOperation, 'id'>) => {
    const updatedCopyList = state.formData.fileOperations.copy.map((copy) =>
      copy.id === id ? { ...copy, ...operation } : copy
    );

    dispatch({
      type: 'UPDATE_FILE_OPERATION',
      payload: {
        ...state.formData.fileOperations,
        copy: updatedCopyList,
      },
    });
  };

  const handleRemoveCopy = (id: string) => {
    const newCopyList = state.formData.fileOperations.copy.filter((copy) => copy.id !== id);

    dispatch({
      type: 'UPDATE_FILE_OPERATION',
      payload: {
        ...state.formData.fileOperations,
        copy: newCopyList,
      },
    });
  };

  return (
    <>
      <FormSection title="File Operations" active={true}>
        <CopyList
          copies={state.formData.fileOperations.copy || []}
          onAdd={handleAddCopy}
          onUpdate={handleUpdateCopy}
          onRemove={handleRemoveCopy}
        />
      </FormSection>
    </>
  );
};
