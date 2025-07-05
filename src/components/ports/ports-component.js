// Add port handling
export const addPort = () => {
  const portItem = document.createElement('div')
  portItem.className = 'port-item'
  portItem.innerHTML = `
    <input type="number" name="port-number" min="1" max="65535" placeholder="Port Number" class="port-number">
    <select name="port-protocol" class="port-protocol">
      <option value="tcp">TCP</option>
      <option value="udp">UDP</option>
    </select>
    <button class="remove-port"><i class="fas fa-trash"></i></button>
  `
  document.querySelector('.ports-list').appendChild(portItem)
  setupPortRemoval()
}

const setupPortRemoval = () => {
  document.querySelectorAll('.remove-port').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault()
      e.target.closest('.port-item').remove()
    })
  })
}
