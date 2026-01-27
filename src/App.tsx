import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TemplateEditorScreen } from './screens/TemplateEditorScreen';
import { GeneratorScreen } from './screens/GeneratorScreen';
import { EmailApplyScreen } from './screens/EmailApplyScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/editor" element={<TemplateEditorScreen />} />
        <Route path="/editor/:id" element={<TemplateEditorScreen />} />
        <Route path="/generate/:id" element={<GeneratorScreen />} />
        <Route path="/email/:id" element={<EmailApplyScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
