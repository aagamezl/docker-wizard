
import React from 'react';
import { useWizard } from '../../../contexts/WizardContext';
import FormSection from '../../FormSection/FormSection';
import Input from '../../Input/Input';
import { AttributeList } from '../../AtributeList/AttributeList';

// import styles from './BuildProcess.module.css';

export type EnvVar = {
  key: string;
  value: string;
};

export const BuildProcess = () => {
  const { state, dispatch } = useWizard();

  // Dialog state is now managed by AttributeList

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    dispatch({
      type: 'UPDATE_BUILD_PROCESS',
      payload: {
        ...state.formData.buildProcess,
        [name]: value,
      },
    });
  };

  const handleAddEnvVar = (key: string, value: string) => {
    const newEnvVars = { ...state.formData.buildProcess.envVars, [key]: value };

    dispatch({
      type: 'UPDATE_BUILD_PROCESS',
      payload: {
        ...state.formData.buildProcess,
        envVars: newEnvVars,
      },
    });
  };

  const handleUpdateEnvVar = (oldKey: string, newKey: string, value: string) => {
    const newEnvVars = { ...state.formData.buildProcess.envVars };

    // If key changed, remove the old key
    if (oldKey !== newKey) {
      delete newEnvVars[oldKey];
    }

    // Update with new key-value pair
    newEnvVars[newKey] = value;

    dispatch({
      type: 'UPDATE_BUILD_PROCESS',
      payload: {
        ...state.formData.buildProcess,
        envVars: newEnvVars,
      },
    });
  };

  const handleRemoveEnvVar = (key: string) => {
    const newEnvVars = { ...state.formData.buildProcess.envVars };
    delete newEnvVars[key];

    dispatch({
      type: 'UPDATE_BUILD_PROCESS',
      payload: {
        ...state.formData.buildProcess,
        envVars: newEnvVars,
      },
    });
  };

  // Args handlers
  const handleAddArg = (key: string, value: string) => {
    const newArgs = { ...state.formData.buildProcess.args, [key]: value };

    dispatch({
      type: 'UPDATE_BUILD_PROCESS',
      payload: {
        ...state.formData.buildProcess,
        args: newArgs,
      },
    });
  };

  const handleUpdateArg = (oldKey: string, newKey: string, value: string) => {
    const newArgs = { ...state.formData.buildProcess.args };

    if (oldKey !== newKey) {
      delete newArgs[oldKey];
    }

    newArgs[newKey] = value;

    dispatch({
      type: 'UPDATE_BUILD_PROCESS',
      payload: {
        ...state.formData.buildProcess,
        args: newArgs,
      },
    });
  };

  const handleRemoveArg = (key: string) => {
    const newArgs = { ...state.formData.buildProcess.args };
    delete newArgs[key];

    dispatch({
      type: 'UPDATE_BUILD_PROCESS',
      payload: {
        ...state.formData.buildProcess,
        args: newArgs,
      },
    });
  };

  debugger;

  return (
    <>
      <FormSection title="Build Process" active={true}>
        <AttributeList
          title="Environment Variables"
          attributes={state.formData.buildProcess.envVars || {}}
          keyLabel="Environment Variable"
          valueLabel="Value"
          keyPlaceholder="e.g., DB_HOST"
          valuePlaceholder="e.g., localhost"
          onAdd={handleAddEnvVar}
          onUpdate={handleUpdateEnvVar}
          onRemove={handleRemoveEnvVar}
        />

        <AttributeList
          title="Build Arguments"
          attributes={state.formData.buildProcess.args || {}}
          keyLabel="Argument Name"
          valueLabel="Value"
          keyPlaceholder="e.g., NODE_ENV"
          valuePlaceholder="e.g., production"
          onAdd={handleAddArg}
          onUpdate={handleUpdateArg}
          onRemove={handleRemoveArg}
        />

        <Input
          label="Working Directory"
          name="workdir"
          value={state.formData.buildProcess.workdir}
          onChange={handleChange}
          placeholder="e.g., /app"
        />

        <Input
          label="On Build"
          name="onBuild"
          value={state.formData.buildProcess.onBuild}
          onChange={handleChange}
          placeholder="e.g., ADD . /app/src"
        />

        <Input
          label="Health Check"
          name="healthCheck"
          value={state.formData.buildProcess.healthCheck}
          onChange={handleChange}
          placeholder="e.g., /health"
        />
      </FormSection>
    </>
  );
};

// import { useState } from "react";

// import FormSection from "../../FormSection/FormSection";
// import { useWizard } from "../../../contexts/WizardContext";
// import Button from "../../Button/Button";
// import { Dialog, DialogActions, DialogContent, DialogTitle } from "../../common/Dialog";

// import styles from './BuildProcess.module.css';

// export const BuildProcess = () => {
//   const { state, dispatch } = useWizard();

//   const [isEditingEnvVar, setIsEditingEnvVar] = useState(false);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [editingEnvVar, setEditingEnvVar] = useState<{ key: string; value: string }>({
//     key: '',
//     value: '',
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;

//     dispatch({
//       type: 'UPDATE_BUILD_PROCESS',
//       payload: {
//         ...state.formData.buildProcess,
//         [name]: value,
//       },
//     });
//   };

//   const argEntries = Object.entries(state.formData.buildProcess?.args || {});
//   const envVarEntries = Object.entries(state.formData.buildProcess?.envVars || {});

//   const handleArgChange = (key: string, value: string) => {
//     const args = { ...(state.formData.buildProcess?.args || {}) };

//     if (value) {
//       args[key] = value;
//     } else {
//       delete args[key];
//     }

//     dispatch({
//       type: 'UPDATE_BUILD_PROCESS',
//       payload: {
//         ...state.formData.buildProcess,
//         args
//       }
//     });
//   };

//   const handleEnvVarChange = (key: string, value: string) => {
//     const envVars = { ...(state.formData.buildProcess?.envVars || {}) };

//     if (value) {
//       envVars[key] = value;
//     } else {
//       delete envVars[key];
//     }

//     dispatch({
//       type: 'UPDATE_BUILD_PROCESS',
//       payload: {
//         ...state.formData.buildProcess,
//         envVars
//       }
//     });
//   };

//   function handleAddEnvVar(e: React.FormEvent): void {
//     e.preventDefault();

//     dispatch({
//       type: 'UPDATE_BUILD_PROCESS',
//       payload: {
//         ...state.formData.buildProcess,
//         envVars: {
//           ...state.formData.buildProcess?.envVars,
//           '': ''
//         }
//       }
//     });
//   }

//   function handleAddEnvVarSubmit(e: React.FormEvent): void {
//     e.preventDefault();

//     dispatch({
//       type: 'UPDATE_BUILD_PROCESS',
//       payload: {
//         ...state.formData.buildProcess,
//         envVars: {
//           ...state.formData.buildProcess?.envVars,
//           '': ''
//         }
//       }
//     });

//     setIsDialogOpen(false);
//     setIsEditingEnvVar(false);
//     setEditingEnvVar({ key: '', value: '' });
//   }

//   return (
//     <>
//       <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
//         {/* <DialogTitle>
//               Environment Variables
//             </DialogTitle> */}
//         <DialogTitle>{editingEnvVar ? 'Edit Environment Variable' : 'Add New Environment Variable'}</DialogTitle>

//         <DialogContent>
//           <div className={styles.dialogContent}>
//             <div className={styles.inputGroup}>
//               <Input
//                 label="Label Key"
//                 name="key"
//                 value={editingLabel?.key || ''}
//                 onChange={handleLabelChange}
//                 placeholder="e.g., version"
//                 required
//               />
//               <Input
//                 label="Label Value"
//                 name="value"
//                 value={editingLabel?.value || ''}
//                 onChange={handleLabelChange}
//                 placeholder="e.g., 1.0.0"
//                 required
//               />
//             </div>
//           </div>
//         </DialogContent>
//         <DialogActions>
//           <Button text="Cancel" onClick={() => {
//             setIsDialogOpen(false);
//             setIsEditingEnvVar(false);
//             setEditingEnvVar({ key: '', value: '' });
//           }} />
//           {/* <Button text="Save" /> */}

//           <Button
//             type="button"
//             variant="primary"
//             onClick={handleAddEnvVarSubmit}
//             text={isEditingEnvVar ? 'Update Label' : 'Add Label'}
//           />
//         </DialogActions>
//       </Dialog>
//       <FormSection title="Build Process" active={true}>
//         <div className="step-container">
//           {/* <div className="form-group">
//           <h3>Build Arguments</h3>

//           {argEntries.map(([key, value], index) => (
//             <div key={`arg-${index}`} className="key-value-pair">
//               <input
//                 type="text"
//                 value={key}
//                 onChange={(e) => handleArgChange(e.target.value, value)}
//                 placeholder="ARG_NAME"
//               />
//               <input
//                 type="text"
//                 value={value}
//                 onChange={handleAddEnvVar}
//                 placeholder="default value"
//               />
//             </div>
//           ))}
//         </div> */}

//           <div className="form-group">
//             <h3>Environment Variables</h3>

//           </div>
//           {/* <Input
//           id="build-process"
//           name="buildProcess"
//           type="text"
//           value={state.formData.buildProcess.buildProcess}
//           onChange={handleInputChange}
//           required
//         /> */}
//         </div>
//       </FormSection>
//     </>
//   );
// }