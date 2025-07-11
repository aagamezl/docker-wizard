import { addService, } from './components/services/services-component.js'
import { addPort } from './components/ports/ports-component.js'

import './assets/styles.css'

// Constants
const STEPS = {
  PROJECT_INFO: 1,
  DOCKER_CONFIG: 2,
  DOCKER_COMPOSE: 3,
  REVIEW: 4
}

const TOAST_DURATION = 5000

// DOM Elements
const form = document.querySelector('#wizard-form')
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
    volumes: '',
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

  if (currentStep < STEPS.REVIEW) {
    currentStep++
    updateStepUI()
  }
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
  const volumes = document.querySelector('#volumes')
  const labels = document.querySelector('#labels')

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

  // Validate volumes format
  if (volumes.value.trim() && !isValidVolumes(volumes.value)) {
    volumes.classList.add('error')
    showError('Please enter valid volume mappings (format: /host:/container)')
    volumes.focus()
    return false
  }

  // Validate labels format
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
      return
    }
  })

  return isValid
}

// Helper validation functions
const isValidPort = (port) => {
  const portNumber = parseInt(port)
  return portNumber >= 1 && portNumber <= 65535
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
      return
    }
  })

  return isValid
}

const isValidVolumes = (volumes) => {
  const volumeList = volumes.split(',').map(vol => vol.trim())
  return volumeList.every(vol => 
    vol && vol.includes(':') && 
    vol.split(':').length === 2
  )
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
  formData.project.name = document.querySelector('#project-name').value
  formData.project.baseImage = document.querySelector('#base-image').value
  // Collect ports
  const portsList = document.querySelector('.ports-list')
  const portItems = portsList.querySelectorAll('.port-item')
  formData.docker.ports = []

  portItems.forEach(portItem => {
    const portNumber = portItem.querySelector('.port-number').value.trim()
    const portProtocol = portItem.querySelector('.port-protocol').value
    
    if (portNumber) {
      formData.docker.ports.push({
        number: parseInt(portNumber),
        protocol: portProtocol.toLowerCase()
      })
    }
  })
  formData.docker.environmentVariables = document.querySelector('#environment-variables').value
  formData.docker.workingDir = document.querySelector('#working-dir').value
  formData.docker.command = document.querySelector('#command').value
  formData.docker.entrypoint = document.querySelector('#entrypoint').value
  formData.docker.volumes = document.querySelector('#volumes').value
  formData.docker.labels = document.querySelector('#labels').value

  // Collect Docker Compose services
  formData.dockerCompose.services = []
  document.querySelectorAll('.service-item').forEach(service => {
    const serviceName = service.querySelector('input[placeholder="Service Name"]').value
    const serviceImage = service.querySelector('input[placeholder="Image"]').value
    if (serviceName && serviceImage) {
      formData.dockerCompose.services.push({
        name: serviceName,
        image: serviceImage
      })
    }
  })

  // Generate Dockerfile preview
  const dockerfilePreview = document.querySelector('#dockerfile-preview code')
  dockerfilePreview.textContent = generateDockerfile()

  // Generate Docker Compose preview
  const dockerComposePreview = document.querySelector('#docker-compose-preview code')
  dockerComposePreview.textContent = generateDockerCompose()
}

const generateDockerfile = () => {
  const { baseImage, name } = formData.project
  const { 
    exposedPorts, 
    environmentVariables,
    workingDir,
    command,
    entrypoint,
    volumes,
    labels
  } = formData.docker

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

  // VOLUME
  if (volumes) {
    const volumeList = volumes.split(',').map(vol => vol.trim())
    volumeList.forEach(vol => {
      if (vol) {
        dockerfile += `VOLUME ["${vol}"]\n`
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
