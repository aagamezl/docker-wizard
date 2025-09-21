import { useState } from 'react';
import type { ChangeEvent } from 'react';

import Button from '../../Button/Button';
import { Dialog, DialogTitle, DialogActions, DialogContent } from '../../common/Dialog';
import Input from '../../Input/Input';
import styles from '../../AtributeList/AttributeList.module.css';

export type CopyMode = 'permission' | 'link';

export type CopyOperation = {
  id: string;
  sources: string[];
  destination: string;
  mode: CopyMode;
  // Only used when mode is 'permission'
  chown?: string;
  chmod?: string;
  // Only used when mode is 'link'
  link?: boolean;
  // Common options
  from?: string;
};

type CopyListProps = {
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
        <DialogTitle>{editingId ? 'Edit COPY Operation' : 'Add COPY Operation'}</DialogTitle>
        <DialogContent>
          <div className={styles.inputGroup}>
            <Input
              label="Sources (comma-separated)"
              name="sources"
              value={formData.sources.join(', ')}
              onChange={handleInputChange}
              placeholder="e.g., file1.txt, file2.txt"
              required
            />
            <Input
              label="Destination"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              placeholder="e.g., /app/"
              required
            />

            <div className={styles.optionSection}>
              <h4>Copy Mode</h4>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="mode"
                    value="permission"
                    checked={formData.mode === 'permission'}
                    onChange={handleInputChange}
                  />
                  <span>Set File Permissions</span>
                  <span className={styles.radioDescription}>
                    Set specific ownership and permissions for the copied files
                  </span>
                </label>
                
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="mode"
                    value="link"
                    checked={formData.mode === 'link'}
                    onChange={handleInputChange}
                  />
                  <span>Optimize for Build Speed (--link)</span>
                  <span className={styles.radioDescription}>
                    Use build cache optimization for faster builds
                  </span>
                </label>
              </div>

              {formData.mode === 'permission' && (
                <>
                  <Input
                    label="--chown (user:group)"
                    name="chown"
                    value={formData.chown || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., user:group"
                  />
                  <div className={styles.selectContainer}>
                    <label>--chmod (permissions)</label>
                    <select
                      name="chmod"
                      value={formData.chmod || '644'}
                      onChange={handleInputChange}
                      className={styles.select}
                    >
                      <option value="644">644 (rw-r--r--)</option>
                      <option value="755">755 (rwxr-xr-x)</option>
                      <option value="777">777 (rwxrwxrwx)</option>
                      <option value="+x">+x (Add execute)</option>
                      <option value="custom">Custom...</option>
                    </select>
                  </div>
                  {formData.chmod === 'custom' && (
                    <Input
                      label="Custom chmod value"
                      name="chmod"
                      value={formData.chmod}
                      onChange={handleInputChange}
                      placeholder="e.g., 600"
                    />
                  )}
                </>
              )}

              <h4>Advanced Options</h4>
              <Input
                label="--from (image/stage/context)"
                name="from"
                value={formData.from || ''}
                onChange={handleInputChange}
                placeholder="e.g., build"
              />
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
                <button
                  type="button"
                  className={styles.actionButton}
                  onClick={() => handleOpenDialog(copy)}
                  aria-label={`Edit ${copy.id}`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className={styles.actionButton}
                  onClick={() => onRemove(copy.id)}
                  aria-label={`Remove ${copy.id}`}
                >
                  Delete
                </button>
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