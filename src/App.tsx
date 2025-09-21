import { useState } from 'react'

import { StepSelector } from './components/Steps/StepSelector/StepSelector'
import Button from './components/Button/Button'


import { ProjectInfo } from './components/Steps/ProjectInfo/ProjectInfo'
import { ImageConfig } from './components/Steps/ImageConfig/ImageConfig'
import { BuildProcess } from './components/Steps/BuildProcess/BuildProcess'
import { FileOperations } from './components/Steps/FileOperations/FileOperations'
// import { ExecutionControlStep } from './components/Steps/ExecutionControl/ExecutionControlStep'
// import { NetworkConfigStep } from './components/Steps/NetworkConfig/NetworkConfigStep'
// import { MultiStageBuildStep } from './components/Steps/MultiStageBuild/MultiStageBuildStep'
// import { BuildContextStep } from './components/Steps/BuildContext/BuildContextStep'
// import { ReviewStep } from './components/Steps/Review/ReviewStep'

import './App.css'

const STEPS = [
  { id: 1, title: 'Project Info' },
  { id: 2, title: 'Image Config' },
  { id: 3, title: 'Build Process' },
  { id: 4, title: 'File Operations' },
  { id: 5, title: 'Execution' },
  { id: 6, title: 'Network' },
  { id: 7, title: 'Multi-stage' },
  { id: 8, title: 'Build Context' },
  { id: 9, title: 'Review' },
];

const renderStep = (currentStep: number) => {
  switch (currentStep) {
    case 1:
      return <ProjectInfo />;
    case 2:
      return <ImageConfig />;
    case 3:
      return <BuildProcess />;
    case 4:
      return <FileOperations />;
    // case 5:
    //   return <ExecutionControlStep />;
    // case 6:
    //   return <NetworkConfigStep />;
    // case 7:
    //   return <MultiStageBuildStep />;
    // case 8:
    //   return <BuildContextStep />;
    // case 9:
    //   return <ReviewStep />;
    default:
      return null;
  }
};

export const App = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const handleStepClick = (stepNumber: number) => {
    console.log(`Step ${stepNumber} clicked`);

    setCurrentStep(stepNumber);
  };

  const handleNextClick = () => {
    console.log('Next step clicked');

    setCurrentStep(currentStep + 1);
  };

  const handlePreviousClick = () => {
    console.log('Previous step clicked');

    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="container">
      <header>
        <h1>Docker & Docker Compose Wizard</h1>
        <p>Create your Docker and Docker Compose files easily</p>
      </header>

      <main>
        <div className="wizard-steps">
          {STEPS.map((step) => (
            <StepSelector
              key={step.id}
              number={step.id}
              title={step.title}
              active={currentStep === step.id}
              onClick={() => handleStepClick(step.id)}
            />
          ))}
        </div>

        <div>
          {renderStep(currentStep)}

          <div className="form-navigation">
            <Button text="Previous" variant="secondary" disabled={currentStep === 1} onClick={handlePreviousClick} />
            <Button text="Next" variant="primary" disabled={currentStep === STEPS.length} onClick={handleNextClick} />
            <Button text="Generate Files" variant="primary" disabled={currentStep !== STEPS.length} onClick={handleNextClick} />
          </div>
        </div>
      </main>
    </div>
  )
}

