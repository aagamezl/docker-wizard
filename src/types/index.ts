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

// export interface DockerConfig {
//   ports: Port[];
//   volumes: Volume[];
//   environmentVariables: string;
//   workingDir: string;
//   command: string;
//   entrypoint: string;
//   labels: string;
//   buildArgs: string;
// }
export interface ImageConfig {
  baseImage: string;
  labels: Record<string, string>;
  shell: string;
  stopSignal: string;
}

export interface FileOperation {
  id: string;
  type: 'COPY' | 'ADD';
  sources: string[];
  destination: string;
  options?: {
    from?: string;
    chown?: string;
    chmod?: string;
    link?: boolean;
    parents?: boolean;
    exclude?: string[];
  };
}

export interface BuildProcess {
  args: Record<string, string>;
  envVars: Record<string, string>;
  workdir: string;
  onBuild: string;
  healthCheck: string;
  fileOperations: FileOperation[];
}

export interface DockerComposeService {
  name: string;
  image: string;
}

export interface FormData {
  project: ProjectInfo;
  imageConfig: ImageConfig;
  buildProcess: BuildProcess;
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
  | 'UPDATE_IMAGE_CONFIG'
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
  | 'SET_STEP'
  | 'UPDATE_BUILD_PROCESS'
  | 'ADD_FILE_OPERATION'
  | 'UPDATE_FILE_OPERATION'
  | 'REMOVE_FILE_OPERATION';
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
