import { addService } from './components/services/services-component.js'
import { addPort } from './components/ports/ports-component.js'
import { addVolume, getVolumes } from './components/volumes/volumes-component.js'
import { addBuildEnv, getBuildEnv } from './components/build-env/build-env-component.js'

import './assets/styles.css'

// Constants
const STEPS = {
  PROJECT_INFO: 1,
  BUILD_ARGS: 2,
  DOCKER_CONFIG: 3,
  DOCKER_COMPOSE: 4,
  REVIEW: 5
}

const TOAST_DURATION = 5000

// DOM Elements
const steps = document.querySelectorAll('.step')
const formSections = document.querySelectorAll('.form-section')
const prevBtn = document.querySelector('.prev-btn')
const nextBtn = document.querySelector('.next-btn')
const generateBtn = document.querySelector('.generate-btn')
const addServiceBtn = document.querySelector('.add-service')
const addPortBtn = document.querySelector('.add-port')

// State Management
let currentStep = STEPS.PROJECT_INFO
const formData = {
  project: {
    name: '',
    baseImage: ''
  },
  docker: {
    exposedPorts: '',
    environmentVariables: '',
    workingDir: '',
    command: '',
    entrypoint: '',
    volumes: [],
    ports: [],
    labels: ''
  },
  dockerCompose: {
    services: []
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateStepUI()
  setupEventListeners()

  // Add event listeners for Add Volume and Add Build Env buttons after DOM is loaded
  const addVolumeBtn = document.querySelector('.add-volume')
  if (addVolumeBtn) {
    addVolumeBtn.addEventListener('click', addVolume)
  }

  const addBuildEnvBtn = document.querySelector('.add-build-env')
  if (addBuildEnvBtn) {
    addBuildEnvBtn.addEventListener('click', addBuildEnv)
  }
})

const setupEventListeners = () => {
  // Event Listeners
  generateBtn.addEventListener('click', handleSubmit)
  prevBtn.addEventListener('click', handlePrev)
  nextBtn.addEventListener('click', handleNext)
  addServiceBtn.addEventListener('click', addService)
  addPortBtn.addEventListener('click', addPort)
  steps.forEach(step => step.addEventListener('click', handleStepClick))
}

// Functions
const handlePrev = () => {
  if (currentStep > STEPS.PROJECT_INFO) {
    currentStep--
    updateStepUI()
  }
}

const handleNext = () => {
  // Validate current step before moving forward
  switch (currentStep) {
    case STEPS.PROJECT_INFO:
      if (!validateProjectInfo()) return
      break
    case STEPS.BUILD_ARGS:
      // No validation needed for Build Arguments step
      break
    case STEPS.DOCKER_CONFIG:
      if (!validateDockerConfig()) return
      break
    case STEPS.DOCKER_COMPOSE:
      if (!validateDockerCompose()) return
      break
    case STEPS.REVIEW:
      // No validation needed for review step
      break
  }

  currentStep++
  updateStepUI()
}

const handleStepClick = (e) => {
  const targetStep = parseInt(e.target.closest('.step').querySelector('.step-number').textContent, 10)

  // If moving forward, validate all steps in between
  if (targetStep > currentStep) {
    for (let i = currentStep; i < targetStep; i++) {
      switch (i) {
        case STEPS.PROJECT_INFO:
          if (!validateProjectInfo()) return
          break
        case STEPS.DOCKER_CONFIG:
          if (!validateDockerConfig()) return
          break
        case STEPS.DOCKER_COMPOSE:
          if (!validateDockerCompose()) return
          break
      }
    }
  }

  // If valid, update current step and UI
  currentStep = targetStep
  updateStepUI()
}

// Validate each step
const validateProjectInfo = () => {
  const projectName = document.querySelector('#project-name')
  const baseImage = document.querySelector('#base-image')

  if (!projectName.value.trim()) {
    projectName.classList.add('error')
    showError('Please enter a project name')
    projectName.focus()
    return false
  }

  if (!baseImage.value.trim()) {
    baseImage.classList.add('error')
    showError('Please enter a base image')
    baseImage.focus()
    return false
  }

  return true
}

const validateDockerConfig = () => {
  const environmentVariables = document.querySelector('#environment-variables')

  // Validate ports
  if (!validatePorts()) {
    return false
  }

  if (environmentVariables.value.trim() && !isValidEnvVars(environmentVariables.value)) {
    environmentVariables.classList.add('error')
    showError('Please enter valid environment variables (key=value)')
    environmentVariables.focus()
    return false
  }

  const volumesList = document.querySelector('.volumes-list')
  const volumeItems = volumesList.querySelectorAll('.volume-item')
  volumeItems.forEach(volume => {
    const hostPath = volume.querySelector('.host-path').value
    const containerPath = volume.querySelector('.container-path').value

    if (hostPath.trim() && !isValidPath(hostPath)) {
      volume.querySelector('.host-path').classList.add('error')
      showError('Please enter a valid host path')
      volume.querySelector('.host-path').focus()
      return false
    }

    if (containerPath.trim() && !isValidPath(containerPath)) {
      volume.querySelector('.container-path').classList.add('error')
      showError('Please enter a valid container path')
      volume.querySelector('.container-path').focus()
      return false
    }
  })

  // Validate labels format
  const labels = document.querySelector('#labels')
  if (labels.value.trim() && !isValidLabels(labels.value)) {
    labels.classList.add('error')
    showError('Please enter valid labels (key=value)')
    labels.focus()
    return false
  }

  return true
}

const validateDockerCompose = () => {
  const services = document.querySelectorAll('.service-item')
  let isValid = true

  services.forEach(service => {
    const serviceName = service.querySelector('input[placeholder="Service Name"]').value
    const serviceImage = service.querySelector('input[placeholder="Image"]').value

    if (!serviceName.trim()) {
      showError('Please enter a service name')
      service.querySelector('input[placeholder="Service Name"]').focus()
      isValid = false
      return
    }

    if (!serviceImage.trim()) {
      showError('Please enter a service image')
      service.querySelector('input[placeholder="Image"]').focus()
      isValid = false
    }
  })

  const volumesList = document.querySelector('.volumes-list')
  const volumes = volumesList.querySelectorAll('.volume-item')
  volumes.forEach(volume => {
    const hostPath = volume.querySelector('.host-path').value
    const containerPath = volume.querySelector('.container-path').value

    if (!hostPath.trim()) {
      showError('Please enter a valid host path')
      volume.querySelector('.host-path').focus()
      isValid = false
      return
    }

    if (!containerPath.trim()) {
      showError('Please enter a valid container path')
      volume.querySelector('.container-path').focus()
      isValid = false
    }
  })

  return isValid
}

// Helper validation functions
const isValidPort = (port) => {
  const portNumber = parseInt(port)
  return portNumber >= 1 && portNumber <= 65535
}

const isValidPath = (path) => {
  // Basic path validation - starts with / and contains only valid characters
  return path.startsWith('/') && /^[a-zA-Z0-9_/.-]+$/.test(path)
}

const isValidPortNumber = (portNumber) => {
  return /^\d+$/.test(portNumber) && isValidPort(portNumber)
}

const isValidPortProtocol = (protocol) => {
  return ['tcp', 'udp'].includes(protocol.toLowerCase())
}

const validatePorts = () => {
  const portsList = document.querySelector('.ports-list')
  const portItems = portsList.querySelectorAll('.port-item')
  let isValid = true

  portItems.forEach(portItem => {
    const portNumber = portItem.querySelector('.port-number').value.trim()
    const portProtocol = portItem.querySelector('.port-protocol').value

    if (!portNumber) {
      showError('Please enter a port number')
      portItem.querySelector('.port-number').focus()
      isValid = false
      return
    }

    if (!isValidPortNumber(portNumber)) {
      showError('Please enter a valid port number (1-65535)')
      portItem.querySelector('.port-number').focus()
      isValid = false
      return
    }

    if (!isValidPortProtocol(portProtocol)) {
      showError('Please select a valid protocol (TCP or UDP)')
      portItem.querySelector('.port-protocol').focus()
      isValid = false
    }
  })

  return isValid
}

const isValidLabels = (labels) => {
  const labelList = labels.split('\n')
  return labelList.every(label =>
    label.trim() && label.includes('=') &&
    !label.startsWith('=') &&
    !label.endsWith('=')
  )
}

const isValidEnvVars = (vars) => {
  const envVars = vars.split('\n')
  return envVars.every(varStr =>
    varStr.trim() && varStr.includes('=')
  )
}

const updateStepUI = () => {
  // Update step indicators
  steps.forEach(step => {
    const stepNumber = parseInt(step.querySelector('.step-number').textContent)

    if (stepNumber <= currentStep) {
      step.classList.add('active')
    } else {
      step.classList.remove('active')
    }
  })

  // Update form sections
  formSections.forEach(section => {
    const stepNumber = parseInt(section.dataset.step)

    if (stepNumber === currentStep) {
      section.classList.add('active')
    } else {
      section.classList.remove('active')
    }
  })

  // Update navigation buttons
  prevBtn.disabled = currentStep === STEPS.PROJECT_INFO
  nextBtn.disabled = currentStep === STEPS.REVIEW
  generateBtn.disabled = currentStep !== STEPS.REVIEW
}

const handleSubmit = (e) => {
  e.preventDefault()

  if (!validateForm()) {
    showError('Please fill in all required fields')

    return
  }

  // Collect form data
  const project = {
    name: document.querySelector('#project-name').value,
    baseImage: document.querySelector('#base-image').value
  }

  // Get ports
  const portsList = document.querySelector('.ports-list')
  const portItems = portsList.querySelectorAll('.port-item')
  const ports = []
  portItems.forEach(portItem => {
    const portNumber = portItem.querySelector('.port-number').value.trim()
    const portProtocol = portItem.querySelector('.port-protocol').value
    
    if (portNumber) {
      ports.push({
        number: parseInt(portNumber),
        protocol: portProtocol.toLowerCase()
      })
    }
  })

  // Get services
  const servicesList = document.querySelector('.services-list')
  const serviceItems = servicesList.querySelectorAll('.service-item')
  const services = []
  serviceItems.forEach(serviceItem => {
    const serviceName = serviceItem.querySelector('input[placeholder="Service Name"]').value.trim()
    const serviceImage = serviceItem.querySelector('input[placeholder="Image"]').value.trim()
    
    if (serviceName && serviceImage) {
      services.push({
        name: serviceName,
        image: serviceImage
      })
    }
  })

  // Generate files
  const dockerfilePreview = document.querySelector('#dockerfile-preview code')
  const dockerComposePreview = document.querySelector('#docker-compose-preview code')
  const buildCommandPreview = document.querySelector('#build-command-preview code')
  const runCommandPreview = document.querySelector('#run-command-preview code')
  
  dockerfilePreview.textContent = generateDockerfile()
  dockerComposePreview.textContent = generateDockerCompose()

  // Generate build command
  const buildCommand = `docker build -t ${project.name} .`
  buildCommandPreview.textContent = buildCommand

  // Generate run command with volumes and build environment variables
  let runCommand = `docker run -d --name ${project.name}`
  if (ports.length > 0) {
    ports.forEach(port => {
      runCommand += ` -p ${port.number}/${port.protocol}`
    })
  }
  const buildEnv = getBuildEnv()
  if (buildEnv.length > 0) {
    buildEnv.forEach(env => {
      runCommand += ` -e "${env}"`
    })
  }
  const volumes = getVolumes()
  if (volumes.length > 0) {
    volumes.forEach(volume => {
      runCommand += ` -v "${volume}"`
    })
  }
  const workingDir = document.querySelector('#working-dir').value.trim()
  if (workingDir) {
    runCommand += ` -w "${workingDir}"`
  }
  const command = document.querySelector('#command').value.trim()
  if (command) {
    runCommand += ` ${command}`
  } else {
    const entrypoint = document.querySelector('#entrypoint').value.trim()
    if (entrypoint) {
      runCommand += ` --entrypoint "${entrypoint}"`
    }
  }
  runCommandPreview.textContent = runCommand

  // Enable generate button
  generateBtn.disabled = false
}

const generateDockerfile = () => {
  const { baseImage } = formData.project
  const {
    environmentVariables,
    workingDir,
    command,
    entrypoint,
    labels
  } = formData.docker
  // const volumes = getVolumes()

  let dockerfile = `FROM ${baseImage}\n\n`

  // WORKDIR
  if (workingDir) {
    dockerfile += `WORKDIR ${workingDir}\n\n`
  }

  // EXPOSE
  if (formData.docker.ports.length > 0) {
    formData.docker.ports.forEach(port => {
      dockerfile += `EXPOSE ${port.number}/${port.protocol}\n`
    })
    dockerfile += '\n'
  }

  // ENV
  if (environmentVariables) {
    const envVars = environmentVariables.split('\n')
    envVars.forEach(varStr => {
      if (varStr.trim()) {
        const [key, value] = varStr.split('=').map(s => s.trim())
        dockerfile += `ENV ${key}=${value}\n`
      }
    })
    dockerfile += '\n'
  }

  // LABEL
  if (labels) {
    const labelList = labels.split('\n')
    labelList.forEach(label => {
      if (label.trim()) {
        const [key, value] = label.split('=').map(s => s.trim())
        dockerfile += `LABEL ${key}="${value}"\n`
      }
    })
    dockerfile += '\n'
  }

  // CMD
  if (command) {
    dockerfile += `CMD ["${command}"]\n`
  }

  // ENTRYPOINT
  if (entrypoint) {
    dockerfile += `ENTRYPOINT ["${entrypoint}"]\n`
  }

  return dockerfile
}

const generateDockerCompose = () => {
  const { services } = formData.dockerCompose
  const compose = {
    version: '3.8',
    services: {}
  }

  services.forEach(service => {
    compose.services[service.name] = {
      image: service.image,
      build: '.',
      ports: [],
      environment: []
    }
  })

  return JSON.stringify(compose, null, 2)
}

// Validate form using the required property
const validateForm = () => {
  const requiredFields = document.querySelectorAll('input[required], textarea[required]')
  let isValid = true

  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      isValid = false
      field.classList.add('error')
    } else {
      field.classList.remove('error')
    }
  })

  return isValid
}

// Show error message like a toast
const showError = (message, duration = TOAST_DURATION) => {
  const toast = document.createElement('div')
  toast.className = 'toast error'
  toast.textContent = message
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, duration)
}
