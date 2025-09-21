import { useState } from 'react';
import type { ChangeEvent } from 'react';

import Button from '../Button/Button';
import { Dialog, DialogTitle, DialogActions, DialogContent } from '../common/Dialog';
import Input from '../Input/Input';
import styles from './AttributeList.module.css';

type AttributeListProps<T extends Record<string, string>> = {
  title: string;
  attributes: T;
  keyLabel?: string;
  valueLabel?: string;
  onAdd: (key: string, value: string) => void;
  onUpdate: (oldKey: string, newKey: string, value: string) => void;
  onRemove: (key: string) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
};

const singularize = (word: string): string => {
  if (word.endsWith('ies')) {
    return word.slice(0, -3) + 'y';
  } else if (word.endsWith('s')) {
    return word.slice(0, -1);
  }
  return word;
};

export const AttributeList = <T extends Record<string, string>>({
  title,
  attributes,
  keyLabel = 'Key',
  valueLabel = 'Value',
  keyPlaceholder = 'e.g., key',
  valuePlaceholder = 'e.g., value',
  onAdd,
  onUpdate,
  onRemove,
}: AttributeListProps<T>) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<{ key: string; value: string; isEditing: boolean }>({
    key: '',
    value: '',
    isEditing: false,
  });
  const [formData, setFormData] = useState({ key: '', value: '' });

  const handleOpenDialog = (attr?: { key: string; value: string }) => {
    if (attr) {
      setEditing({ key: attr.key, value: attr.value, isEditing: true });
      setFormData({ key: attr.key, value: attr.value });
    } else {
      setEditing({ key: '', value: '', isEditing: false });
      setFormData({ key: '', value: '' });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditing({ key: '', value: '', isEditing: false });
    setFormData({ key: '', value: '' });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.key.trim() || !formData.value.trim()) return;

    if (editing.isEditing) {
      onUpdate(editing.key, formData.key, formData.value);
    } else {
      onAdd(formData.key, formData.value);
    }
    
    handleCloseDialog();
  };

  const handleEdit = (key: string) => {
    const value = attributes[key] || '';
    handleOpenDialog({ key, value });
  };

  const handleAdd = () => {
    handleOpenDialog();
  };

  return (
    <div className={styles.attributesSection}>
      <Dialog isOpen={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{editing.isEditing ? `Edit ${singularize(title)}` : `Add New ${singularize(title)}`}</DialogTitle>
        <DialogContent>
          <div className={styles.inputGroup}>
            <Input
              label={keyLabel}
              name="key"
              value={formData.key}
              onChange={handleChange}
              placeholder={keyPlaceholder}
              required
              disabled={editing.isEditing}
            />
            <Input
              label={valueLabel}
              name="value"
              value={formData.value}
              onChange={handleChange}
              placeholder={valuePlaceholder}
              required
            />
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
            text={editing.isEditing ? 'Update' : 'Add'}
          />
        </DialogActions>
      </Dialog>

      <div className={styles.attributesHeader}>
        <h3>{title}</h3>
        <Button
          variant="secondary"
          onClick={handleAdd}
          text={`+ Add ${singularize(title)}`}
        />
      </div>

      {Object.keys(attributes).length > 0 ? (
        <div className={styles.attributesTable}>
          <div className={`${styles.attributesRow} ${styles.attributesHeaderRow}`}>
            <div className={styles.attributeKeyCell}>{keyLabel}</div>
            <div className={styles.attributeValueCell}>{valueLabel}</div>
            <div className={styles.attributeActionsCell}>Actions</div>
          </div>
          {Object.entries(attributes).map(([key, value]) => (
            <div key={key} className={styles.attributesRow}>
              <div className={styles.attributeKeyCell} title={key}>{key}</div>
              <div className={styles.attributeValueCell} title={String(value)}>
                {String(value)}
              </div>
              <div className={styles.attributeActionsCell}>
                <button
                  type="button"
                  className={styles.actionButton}
                  onClick={() => handleEdit(key)}
                  aria-label={`Edit ${key}`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className={styles.actionButton}
                  onClick={() => onRemove(key)}
                  aria-label={`Remove ${key}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noAttributes}>
          No {title.toLowerCase()} added yet. Click <b>[+ Add {singularize(title)}]</b> to create one.
        </div>
      )}
    </div>
  );
};