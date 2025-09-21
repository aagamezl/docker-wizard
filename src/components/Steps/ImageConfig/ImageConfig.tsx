
import React from 'react';
import { useWizard } from '../../../contexts/WizardContext';
import FormSection from '../../FormSection/FormSection';
import Input from '../../Input/Input';
import { AttributeList } from '../../AtributeList/AttributeList';


export const ImageConfig = () => {
  const { state, dispatch } = useWizard();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    dispatch({
      type: 'UPDATE_IMAGE_CONFIG',
      payload: {
        ...state.formData.imageConfig,
        [name]: value,
      },
    });
  };

  const handleAddLabel = (key: string, value: string) => {
    const newLabels = { ...state.formData.imageConfig.labels, [key]: value };
    
    dispatch({
      type: 'UPDATE_IMAGE_CONFIG',
      payload: {
        ...state.formData.imageConfig,
        labels: newLabels,
      },
    });
  };

  const handleUpdateLabel = (oldKey: string, newKey: string, value: string) => {
    const newLabels = { ...state.formData.imageConfig.labels };
    
    // If key changed, remove the old key
    if (oldKey !== newKey) {
      delete newLabels[oldKey];
    }
    
    // Update with new key-value pair
    newLabels[newKey] = value;
    
    dispatch({
      type: 'UPDATE_IMAGE_CONFIG',
      payload: {
        ...state.formData.imageConfig,
        labels: newLabels,
      },
    });
  };

  const handleRemoveLabel = (key: string) => {
    const newLabels = { ...state.formData.imageConfig.labels };
    delete newLabels[key];

    dispatch({
      type: 'UPDATE_IMAGE_CONFIG',
      payload: {
        ...state.formData.imageConfig,
        labels: newLabels,
      },
    });
  };

  return (
    <FormSection title="Image Configuration" active={true}>
      <AttributeList
        title="Labels"
        attributes={state.formData.imageConfig.labels || {}}
        keyLabel="Label Key"
        valueLabel="Label Value"
        keyPlaceholder="e.g., version"
        valuePlaceholder="e.g., 1.0.0"
        onAdd={handleAddLabel}
        onUpdate={handleUpdateLabel}
        onRemove={handleRemoveLabel}
      />

      <Input
        label="Base Image"
        name="baseImage"
        value={state.formData.imageConfig.baseImage || ''}
        onChange={handleChange}
        placeholder="e.g., node:16-alpine"
      />

      <Input
        label="Shell"
        name="shell"
        value={state.formData.imageConfig.shell || ''}
        onChange={handleChange}
        placeholder="e.g., /bin/bash"
      />

      <Input
        label="Stop Signal"
        name="stopSignal"
        value={state.formData.imageConfig.stopSignal || ''}
        onChange={handleChange}
        placeholder="e.g., SIGTERM"
      />
    </FormSection>
  );
};