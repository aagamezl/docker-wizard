import './volumes.css'

export function addVolume() {
  const volumesList = document.querySelector('.volumes-list');
  const volumeItem = document.createElement('div');
  volumeItem.className = 'volume-item';
  volumeItem.innerHTML = `
    <div class="volume-fields">
      <div class="form-group">
        <label>Host Path</label>
        <input type="text" class="host-path" placeholder="/data">
      </div>
      <div class="form-group">
        <label>Container Path</label>
        <input type="text" class="container-path" placeholder="/app/data">
      </div>
    </div>
    <button type="button" class="remove-volume">
      <i class="fas fa-trash"></i>
    </button>
  `;

  volumeItem.querySelector('.remove-volume').addEventListener('click', () => {
    volumeItem.remove();
  });

  volumesList.appendChild(volumeItem);
}

export function getVolumes() {
  const volumesList = document.querySelector('.volumes-list');
  const volumeItems = volumesList.querySelectorAll('.volume-item');
  const volumes = [];

  volumeItems.forEach(volumeItem => {
    const hostPath = volumeItem.querySelector('.host-path').value.trim();
    const containerPath = volumeItem.querySelector('.container-path').value.trim();
    if (hostPath && containerPath) {
      volumes.push(`${hostPath}:${containerPath}`);
    }
  });

  return volumes.join(',');
}
