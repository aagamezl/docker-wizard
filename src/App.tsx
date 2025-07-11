import Step from './components/Step/Step'
import FormSection from './components/FormSection/FormSection'
import Button from './components/Button/Button'
import FilePreview from './components/FilePreview/FilePreview'

import './App.css'

function App() {
  return (
    <div className="container">
      <header>
        <h1>Docker & Docker Compose Wizard</h1>
        <p>Create your Docker and Docker Compose files easily</p>
      </header>

      <main>
        <div className="wizard-steps">
          <Step number={1} title="Project Info" active={true} />
          <Step number={2} title="Build Arguments" />
          <Step number={3} title="Docker Configuration" />
          <Step number={4} title="Docker Compose" />
          <Step number={5} title="Review & Generate" />
        </div>

        <form id="wizard-form">
          <FormSection title="Project Information" active={true}>
            <div className="form-group">
              <label htmlFor="project-name">Project Name</label>
              <input type="text" id="project-name" required />
            </div>
            <div className="form-group">
              <label htmlFor="base-image">Base Image</label>
              <input type="text" id="base-image" required />
            </div>
          </FormSection>

          <FormSection title="Build Arguments">
            <div className="form-group">
              <h3>Volume Binding</h3>
              <div className="volumes-list"></div>
              <Button text="Add Volume" variant="primary" />
            </div>
            <div className="form-group">
              <h3>Environment Variables</h3>
              <div className="build-env-list"></div>
              <Button text="Add Environment Variable" variant="primary" />
            </div>
          </FormSection>

          <FormSection title="Docker Configuration">
            <div className="form-group">
              <h3>Ports</h3>
              <div className="ports-list"></div>
              <Button text="Add Port" variant="primary" />
            </div>
            <div className="form-group">
              <label htmlFor="environment-variables">Environment Variables (key=value)</label>
              <textarea id="environment-variables" rows={3}></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="working-dir">Working Directory</label>
              <input type="text" id="working-dir" placeholder="/app" />
            </div>
            <div className="form-group">
              <label htmlFor="command">Command</label>
              <input type="text" id="command" />
            </div>
            <div className="form-group">
              <label htmlFor="entrypoint">Entrypoint</label>
              <input type="text" id="entrypoint" />
            </div>
            <div className="form-group">
              <label htmlFor="labels">Labels (key=value)</label>
              <textarea id="labels" rows={2}></textarea>
            </div>
          </FormSection>

          <FormSection title="Docker Compose Configuration">
            <div className="form-group">
              <h3>Services</h3>
              <div className="services-list"></div>
              <Button text="Add Service" variant="primary" />
            </div>
          </FormSection>

          <FormSection title="Review & Generate">
            <div className="generated-files">
              <FilePreview 
                title="Dockerfile" 
                language="dockerfile" 
                content="" 
              />
              <FilePreview 
                title="docker-compose.yml" 
                language="yaml" 
                content="" 
              />
              <FilePreview 
                title="Build Command" 
                language="bash" 
                content="" 
              />
              <FilePreview 
                title="Run Command" 
                language="bash" 
                content="" 
              />
            </div>
          </FormSection>

          <div className="form-navigation">
            <Button text="Previous" variant="secondary" disabled={true} />
            <Button text="Next" variant="primary" />
            <Button text="Generate Files" variant="primary" disabled={true} />
          </div>
        </form>
      </main>
    </div>
  )
}

export default App
