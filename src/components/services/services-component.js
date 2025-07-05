const servicesList = document.querySelector('.services-list')

export const addService = () => {
  const serviceItem = document.createElement('div')
  serviceItem.className = 'service-item'

  serviceItem.innerHTML = `
    <input type="text" name="serviceName" placeholder="Service Name">
    <input type="text" name="serviceImage" placeholder="Image">
    <button class="remove-service"><i class="fas fa-trash"></i></button>
  `

  servicesList.appendChild(serviceItem)
  setupServiceRemoval()
}

const setupServiceRemoval = () => {
  document.querySelectorAll('.remove-service').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault()
      e.target.closest('.service-item').remove()
    })
  })
}