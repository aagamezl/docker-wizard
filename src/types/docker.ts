export interface DockerFormData {
  projectInfo?: {
    name: string;
    description: string;
    version: string;
  };
  imageConfig?: {
    baseImage: string;
    maintainer: string;
    labels: Record<string, string>;
  };
  buildProcess?: {
    args: Record<string, string>;
    envVars: Record<string, string>;
    workdir: string;
  };
  fileOperations?: {
    copy: Array<{ source: string; destination: string }>;
    add: Array<{ source: string; destination: string }>;
    volumes: string[];
  };
  executionControl?: {
    cmd: string[];
    entrypoint: string[];
    user: string;
  };
  networkConfig?: {
    expose: string[];
    ports: Array<{ host: string; container: string }>;
  };
  multiStage?: {
    stages: Array<{
      name: string;
      baseImage: string;
      copyFrom?: string;
    }>;
  };
  buildContext?: {
    dockerignore: string[];
    buildArgs: Record<string, string>;
  };
}

export interface StepProps {
  data: Partial<DockerFormData>;
  onUpdate: (data: Partial<DockerFormData>) => void;
}
