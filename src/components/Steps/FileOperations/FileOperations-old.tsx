import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useWizard } from '../../../contexts/WizardContext';
import FormSection from '../../FormSection/FormSection';
import Input from '../../Input/Input';
import Button from '../../Button/Button';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '../../common/Dialog';
import type { FileOperation } from '../../../types';
import styles from './FileOperations.module.css';

const DEFAULT_FILE_OPERATION: Omit<FileOperation, 'id'> = {
  type: 'COPY',
  sources: [''],
  destination: '',
  options: {
    from: '',
    chown: '',
    chmod: '',
    link: false,
    parents: false,
    exclude: []
  }
};

type FileOperationForm = Omit<FileOperation, 'id'>;

export const FileOperations = () => {
  const { state, dispatch } = useWizard();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [operation, setOperation] = useState<Omit<FileOperation, 'id'>>(DEFAULT_FILE_OPERATION);
  const [currentSource, setCurrentSource] = useState('');
  const [currentExclude, setCurrentExclude] = useState('');

  const fileOperations = state.formData.buildProcess.fileOperations || [];

  const resetForm = () => {
    setOperation({ ...DEFAULT_FILE_OPERATION });
    setCurrentSource('');
    setCurrentExclude('');
    setEditingId(null);
  };

  const handleOpenDialog = (op?: FileOperation) => {
    if (op) {
      const { id, ...rest } = op;
      setOperation(rest);
      setEditingId(id);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (name.startsWith('options.')) {
      const optionName = name.split('.')[1] as keyof FileOperation['options'];
      setOperation(prev => ({
        ...prev,
        options: {
          ...prev.options,
          [optionName]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }
      }));
    } else {
      setOperation(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSource = () => {
    if (currentSource.trim()) {
      setOperation(prev => ({
        ...prev,
        sources: [...prev.sources, currentSource.trim()]
      }));
      setCurrentSource('');
    }
  };

  const handleRemoveSource = (index: number) => {
    setOperation(prev => ({
      ...prev,
      sources: prev.sources.filter((_, i) => i !== index)
    }));
  };

  const handleAddExclude = () => {
    if (currentExclude.trim() && operation.options) {
      setOperation(prev => ({
        ...prev,
        options: {
          ...prev.options!,
          exclude: [...(prev.options?.exclude || []), currentExclude.trim()]
        }
      }));
      setCurrentExclude('');
    }
  };

  const handleRemoveExclude = (index: number) => {
    if (!operation.options) return;
    
    setOperation(prev => ({
      ...prev,
      options: {
        ...prev.options!,
        exclude: (prev.options?.exclude || []).filter((_, i) => i !== index)
      }
    }));
  };

  const handleSave = () => {
    if (operation.sources.length === 0 || !operation.destination) {
      // Show error message
      return;
    }

    const op = {
      ...operation,
      id: editingId || Date.now().toString(),
    };

    if (editingId) {
      dispatch({ type: 'UPDATE_FILE_OPERATION', payload: op });
    } else {
      dispatch({ type: 'ADD_FILE_OPERATION', payload: op });
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'REMOVE_FILE_OPERATION', payload: id });
  };

  const formatOperation = (op: FileOperation) => {
    let command = `${op.type} `;
    
    // Add options
    if (op.options) {
      if (op.options.from) command += `--from=${op.options.from} `;
      if (op.options.chown) command += `--chown=${op.options.chown} `;
      if (op.options.chmod) command += `--chmod=${op.options.chmod} `;
      if (op.options.link) command += '--link ';
      if (op.options.parents) command += '--parents ';
      if (op.options.exclude?.length) command += `--exclude=${op.options.exclude.join(' --exclude=')} `;
    }

    // Add sources and destination
    command += `${op.sources.join(' ')} ${op.destination}`;
    
    return command;
  };

  return (
    <div className={styles.container}>
      <FormSection title="File Operations" active={true}>
        <p className={styles.description}>
          Add file operations like COPY or ADD to your Dockerfile. These operations
          help manage files and directories in your container.
        </p>
        
        {fileOperations.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No file operations added yet.</p>
          </div>
        ) : (
          <div className={styles.operationsList}>
            {fileOperations.map((op) => (
              <div key={op.id} className={styles.operationItem}>
                <div className={styles.operationContent}>
                  <span className={styles.operationType}>{op.type}</span>
                  <span className={styles.operationPath} title={formatOperation(op)}>
                    {op.sources.join(', ')} → {op.destination}
                  </span>
                </div>
                <div className={styles.operationActions}>
                  <Button
                    variant="secondary"
                    onClick={() => handleOpenDialog(op)}
                    text="Edit"
                  />
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(op.id)}
                    text="Delete"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className={styles.addButtonContainer}>
          <Button
            variant="primary"
            onClick={() => handleOpenDialog()}
            text="+ Add File Operation"
          />
        </div>
      </FormSection>

      <Dialog isOpen={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingId ? 'Edit File Operation' : 'Add New File Operation'}
        </DialogTitle>
        <DialogContent>
          <div className={styles.formGroup}>
            <label>Operation Type</label>
            <select
              name="type"
              value={operation.type}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="COPY">COPY</option>
              <option value="ADD">ADD</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Source Files/Directories</label>
            <div className={styles.arrayInput}>
              <Input
                value={currentSource}
                onChange={(e) => setCurrentSource(e.target.value)}
                placeholder="e.g., package.json or /src"
                onKeyDown={(e) => e.key === 'Enter' && handleAddSource()}
              />
              <Button
                variant="secondary"
                onClick={handleAddSource}
                text="Add Source"
                type="button"
              />
            </div>
            {operation.sources.length > 0 && (
              <div className={styles.arrayItems}>
                {operation.sources.map((src, index) => (
                  <div key={index} className={styles.arrayItem}>
                    <span>{src}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSource(index)}
                      className={styles.removeButton}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <Input
              label="Destination Path"
              name="destination"
              value={operation.destination}
              onChange={handleChange}
              placeholder="e.g., /app"
              required
            />
          </div>

          <div className={styles.optionsSection}>
            <h4>Options</h4>
            
            <div className={styles.formGroup}>
              <Input
                label="--from (for multi-stage builds)"
                name="options.from"
                value={operation.options?.from || ''}
                onChange={handleChange}
                placeholder="e.g., builder"
              />
            </div>

            <div className={styles.formGroup}>
              <Input
                label="--chown (change ownership)"
                name="options.chown"
                value={operation.options?.chown || ''}
                onChange={handleChange}
                placeholder="e.g., user:group"
              />
            </div>

            <div className={styles.formGroup}>
              <Input
                label="--chmod (change file mode)"
                name="options.chmod"
                value={operation.options?.chmod || ''}
                onChange={handleChange}
                placeholder="e.g., 755"
              />
            </div>

            <div className={styles.checkboxGroup}>
              <label>
                <input
                  type="checkbox"
                  name="options.link"
                  checked={operation.options?.link || false}
                  onChange={handleChange}
                />
                --link (copy symlinks as symlinks)
              </label>
            </div>

            <div className={styles.checkboxGroup}>
              <label>
                <input
                  type="checkbox"
                  name="options.parents"
                  checked={operation.options?.parents || false}
                  onChange={handleChange}
                />
                --parents (preserve parent directories)
              </label>
            </div>

            <div className={styles.formGroup}>
              <label>--exclude patterns</label>
              <div className={styles.arrayInput}>
                <Input
                  value={currentExclude}
                  onChange={(e) => setCurrentExclude(e.target.value)}
                  placeholder="e.g., *.tmp"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddExclude()}
                />
                <Button
                  variant="secondary"
                  onClick={handleAddExclude}
                  text="Add Exclude"
                  type="button"
                />
              </div>
              {operation.options?.exclude && operation.options.exclude.length > 0 && (
                <div className={styles.arrayItems}>
                  {operation.options.exclude.map((pattern, index) => (
                    <div key={index} className={styles.arrayItem}>
                      <span>{pattern}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExclude(index)}
                        className={styles.removeButton}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="secondary" onClick={handleCloseDialog} text="Cancel" />
          <Button variant="primary" onClick={handleSave} text={editingId ? 'Update' : 'Add'} />
        </DialogActions>
      </Dialog>
    </div>
  );
};
