export interface ProjectInfo {
  name: string;
  baseImage: string;
}

export interface Port {
  number: string;
  protocol: 'tcp' | 'udp';
}

export interface Volume {
  hostPath: string;
  containerPath: string;
}

export interface DockerConfig {
  ports: Port[];
  volumes: Volume[];
  environmentVariables: string;
  workingDir: string;
  command: string;
  entrypoint: string;
  labels: string;
  buildArgs: string;
}

export interface DockerComposeService {
  name: string;
  image: string;
}

export interface FormData {
  project: ProjectInfo;
  docker: DockerConfig;
  dockerCompose: {
    services: DockerComposeService[];
  };
}

export interface WizardState {
  currentStep: number;
  formData: FormData;
}

export interface WizardActions {
  type: 
    | 'UPDATE_PROJECT_INFO'
    | 'ADD_PORT'
    | 'REMOVE_PORT'
    | 'UPDATE_PORT'
    | 'ADD_VOLUME'
    | 'REMOVE_VOLUME'
    | 'UPDATE_VOLUME'
    | 'UPDATE_DOCKER_CONFIG'
    | 'ADD_SERVICE'
    | 'REMOVE_SERVICE'
    | 'UPDATE_SERVICE'
    | 'NEXT_STEP'
    | 'PREV_STEP'
    | 'SET_STEP';
  payload: any;
}

export type Step = 1 | 2 | 3 | 4 | 5;

export interface StepConfig {
  title: string;
  description: string;
  validation: () => boolean;
}

export interface StepProps {
  step: Step;
  config: StepConfig;
  onNext: () => void;
  onPrev: () => void;
}
