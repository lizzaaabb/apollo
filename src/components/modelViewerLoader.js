let loaded = false

export function loadModelViewer() {
  if (loaded || customElements.get('model-viewer')) {
    loaded = true
    return
  }
  loaded = true
  const script = document.createElement('script')
  script.type = 'module'
  script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js'
  document.head.appendChild(script)
}