import { useState } from 'react';
import type { ChangeEvent } from 'react';

import Button from '../../Button/Button';
import { Dialog, DialogTitle, DialogActions, DialogContent } from '../../common/Dialog';
import { ActionButton, ActionButtonVariant } from '../../common/ActionButton/ActionButton';
import type { CopyOperation, CopyMode } from '../../../types';

import styles from './FileOperations.module.css';

export type CopyListProps = {
  copies: CopyOperation[];
  onAdd: (operation: Omit<CopyOperation, 'id'>) => void;
  onUpdate: (id: string, operation: Omit<CopyOperation, 'id'>) => void;
  onRemove: (id: string) => void;
};

export const CopyList = ({ copies, onAdd, onUpdate, onRemove }: CopyListProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<CopyOperation, 'id'>>({
    sources: [''],
    destination: '',
    mode: 'permission',
    chmod: '644',
    chown: 'docker:docker'
  });

  const handleOpenDialog = (copy?: CopyOperation) => {
    if (copy) {
      setEditingId(copy.id);

      setFormData({
        mode: copy.mode,
        sources: [...copy.sources],
        destination: copy.destination,
        chown: copy.chown,
        chmod: copy.chmod,
        link: copy.link,
        from: copy.from
      });
    } else {
      setEditingId(null);

      setFormData({
        sources: [''],
        destination: '',
        mode: 'permission',
        chmod: '644',
        chown: 'docker:docker'
      });
    }

    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement; // For checkbox handling

    if (name === 'sources') {
      // Handle sources array (comma-separated)
      const sources = value.split(',').map(s => s.trim()).filter(Boolean);
      setFormData(prev => ({
        ...prev,
        sources: sources.length ? sources : [''],
      }));
    } else if (name === 'mode') {
      // When mode changes, reset the other mode's values
      setFormData(prev => ({
        ...prev,
        mode: value as CopyMode,
        ...(value === 'permission' ? { link: undefined } : { chown: undefined, chmod: undefined })
      }));
    } else {
      // Handle regular fields
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? target.checked : value,
      }));
    }
  };

  const handleSave = () => {
    if (!formData.sources.length || !formData.sources[0] || !formData.destination) {
      return;
    }

    if (editingId) {
      onUpdate(editingId, formData);
    } else {
      onAdd(formData);
    }

    handleCloseDialog();
  };

  const formatCopyCommand = (copy: CopyOperation): string => {
    const parts = ['COPY'];

    // Add mode-specific options
    if (copy.mode === 'permission') {
      if (copy.chown) parts.push(`--chown=${copy.chown}`);
      if (copy.chmod) parts.push(`--chmod=${copy.chmod}`);
    } else if (copy.mode === 'link') {
      parts.push('--link');
    }

    // Add common options
    if (copy.from) parts.push(`--from=${copy.from}`);

    // Add sources and destination
    parts.push(...copy.sources);
    parts.push(copy.destination);

    return parts.join(' ');
  };

  return (
    <div className={styles.attributesSection}>
      <Dialog isOpen={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingId ? 'Edit COPY Operation' : 'Add COPY Operation'}
        </DialogTitle>
        <DialogContent>
          <div className={styles.inputGroup}>
            <div className={styles.formGroup}>
              <label htmlFor="sources">Sources (comma-separated)</label>
              <input
                id="sources"
                name="sources"
                type="text"
                value={formData.sources.join(', ')}
                onChange={handleInputChange}
                placeholder="e.g., file1.txt, file2.txt"
                className={styles.input}
                required
              />
              <p className={styles.helpText}>Files or patterns to copy</p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="destination">Destination</label>
              <input
                id="destination"
                name="destination"
                type="text"
                value={formData.destination}
                onChange={handleInputChange}
                placeholder="e.g., /app/"
                className={styles.input}
                required
              />
              <p className={styles.helpText}>Destination path in the container</p>
            </div>

            <div className={styles.formGroup}>
              <label>Copy Mode</label>
              <div className={styles.copyModeContainer}>
                {/* Permission Mode Card */}
                <div
                  className={`${styles.copyModeCard} ${formData.mode === 'permission' ? styles.copyModeCardSelected : ''
                    }`}
                  onClick={() => handleInputChange({
                    target: { name: 'mode', value: 'permission' }
                  } as React.ChangeEvent<HTMLInputElement>)}
                >
                  <div className={styles.cardHeader}>
                    <div className={`${styles.cardIcon} ${styles.permissionIcon}`}>🛡️</div>
                    <div>
                      <h4 className={styles.cardTitle}>Set File Permissions</h4>
                    </div>
                  </div>
                  <p className={styles.cardDescription}>
                    Control file ownership and access permissions
                  </p>
                </div>

                {/* Link Mode Card */}
                <div
                  className={`${styles.copyModeCard} ${formData.mode === 'link' ? styles.copyModeCardSelected : ''
                    }`}
                  onClick={() => handleInputChange({
                    target: { name: 'mode', value: 'link' }
                  } as React.ChangeEvent<HTMLInputElement>)}
                >
                  <div className={styles.cardHeader}>
                    <div className={`${styles.cardIcon} ${styles.linkIcon}`}>⚡</div>
                    <div>
                      <h4 className={styles.cardTitle}>Optimize Build Speed</h4>
                    </div>
                  </div>
                  <p className={styles.cardDescription}>
                    Use --link for faster builds
                  </p>
                </div>
              </div>
            </div>

            {formData.mode === 'permission' && (
              <>
                <div className={styles.formGroup}>
                  <label htmlFor="chown">--chown (user:group)</label>
                  <input
                    id="chown"
                    name="chown"
                    type="text"
                    value={formData.chown || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., user:group"
                    className={styles.input}
                  />
                  <p className={styles.helpText}>Set file ownership (user:group)</p>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="chmod">--chmod (permissions)</label>
                  <select
                    id="chmod"
                    name="chmod"
                    value={formData.chmod || '644'}
                    onChange={handleInputChange}
                    className={styles.input}
                  >
                    <option value="644">644 (rw-r--r--)</option>
                    <option value="755">755 (rwxr-xr-x)</option>
                    <option value="777">777 (rwxrwxrwx)</option>
                    <option value="+x">+x (Add execute)</option>
                    <option value="custom">Custom...</option>
                  </select>
                  {formData.chmod === 'custom' && (
                    <input
                      type="text"
                      name="chmod"
                      value={formData.chmod}
                      onChange={handleInputChange}
                      placeholder="e.g., 600"
                      className={`${styles.input} ${styles.mt2}`}
                    />
                  )}
                </div>
              </>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="from">--from (image/stage/context)</label>
              <input
                id="from"
                name="from"
                type="text"
                value={formData.from || ''}
                onChange={handleInputChange}
                placeholder="e.g., build"
                className={styles.input}
              />
              <p className={styles.helpText}>Copy from a specific build stage or image</p>
            </div>

            <div className={styles.formGroup}>
              <label>Command Preview</label>
              <div className={styles.commandPreview}>
                {formatCopyCommand({ ...formData, id: 'preview' })}
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="secondary"
            type="button"
            onClick={handleCloseDialog}
            text="Cancel"
          />
          <Button
            type="button"
            variant="primary"
            onClick={handleSave}
            text={editingId ? 'Update' : 'Add'}
          />
        </DialogActions>
      </Dialog>

      <div className={styles.attributesHeader}>
        <h3>COPY Operations</h3>
        <Button
          variant="secondary"
          onClick={() => handleOpenDialog()}
          text="+ Add COPY Operation"
        />
      </div>

      {copies.length > 0 ? (
        <div className={styles.attributesTable}>
          <div className={`${styles.attributesRow} ${styles.attributesHeaderRow}`}>
            <div className={styles.attributeKeyCell}>Command</div>
            <div className={styles.attributeActionsCell}>Actions</div>
          </div>
          {copies.map(copy => (
            <div key={copy.id} className={styles.attributesRow}>
              <div className={styles.attributeKeyCell} title={formatCopyCommand(copy)}>
                <code>{formatCopyCommand(copy)}</code>
              </div>
              <div className={styles.attributeActionsCell}>
                {/* <button
                  type="button"
                  className={styles.actionButton}
                  onClick={() => handleOpenDialog(copy)}
                  aria-label={`Edit ${copy.id}`}
                >
                  Edit
                </button> */}
                <ActionButton
                  variant={ActionButtonVariant.INFO}
                  onClick={() => handleOpenDialog(copy)}
                  aria-label={`Edit ${copy.id}`}
                >
                  Edit
                </ActionButton>
                {/* <button
                  type="button"
                  className={styles.actionButton}
                  onClick={() => onRemove(copy.id)}
                  aria-label={`Remove ${copy.id}`}
                >
                  Delete
                </button> */}
                <ActionButton
                  variant={ActionButtonVariant.DELETE}
                  onClick={() => onRemove(copy.id)}
                  aria-label={`Remove ${copy.id}`}
                >
                  Delete
                </ActionButton>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noAttributes}>
          No COPY operations added yet. Click <b>[+ Add COPY Operation]</b> to create one.
        </div>
      )}
    </div>
  );
};