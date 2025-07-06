import './build-env.css'

export function addBuildEnv() {
  const buildEnvList = document.querySelector('.build-env-list')
  const buildEnvItem = document.createElement('div')
  buildEnvItem.className = 'build-env-item'
  buildEnvItem.innerHTML = `
    <div class="build-env-fields">
      <div class="form-group">
        <label>Key</label>
        <input type="text" class="build-env-key" placeholder="KEY_NAME">
      </div>
      <div class="form-group">
        <label>Value</label>
        <input type="text" class="build-env-value" placeholder="value">
      </div>
    </div>
    <button type="button" class="remove-build-env">
      <i class="fas fa-trash"></i>
    </button>
  `;

  buildEnvItem.querySelector('.remove-build-env').addEventListener('click', () => {
    buildEnvItem.remove();
  });

  buildEnvList.appendChild(buildEnvItem);
}

export function getBuildEnv() {
  const buildEnvList = document.querySelector('.build-env-list')
  const buildEnvItems = buildEnvList.querySelectorAll('.build-env-item')
  const buildEnv = []

  buildEnvItems.forEach(buildEnvItem => {
    const key = buildEnvItem.querySelector('.build-env-key').value.trim()
    const value = buildEnvItem.querySelector('.build-env-value').value.trim()

    if (key && value) {
      buildEnv.push(`${key}=${value}`)
    }
  })

  return buildEnv
}
