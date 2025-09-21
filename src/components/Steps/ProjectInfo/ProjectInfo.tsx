import { useWizard } from '../../../contexts/WizardContext';
import FormSection from '../../FormSection/FormSection';
import Input from '../../Input/Input';

import './ProjectInfo.css';

export const ProjectInfo = () => {
  const { state, dispatch } = useWizard();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    dispatch({
      type: 'UPDATE_PROJECT_INFO',
      payload: {
        ...state.formData.project,
        [name]: value,
      },
    });
  };

  console.log(state.formData.project);

  return (
    <FormSection title="Project Information" active={true}>
      <div className="form-group">
        <label htmlFor="project-name">Project Name</label>
        <Input
          id="project-name"
          name="name"
          type="text"
          value={state.formData.project.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="base-image">Base Image</label>
        <Input
          id="base-image"
          name="baseImage"
          type="text"
          value={state.formData.project.baseImage}
          onChange={handleInputChange}
          required
        />
      </div>
    </FormSection>
  );
}