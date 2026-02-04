import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TemplateEditorScreen } from './screens/TemplateEditorScreen';
import { GeneratorScreen } from './screens/GeneratorScreen';
import { EmailApplyScreen } from './screens/EmailApplyScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { VariablesScreen } from './screens/VariablesScreen';
import { SettingsScreen } from './screens/SettingsScreen';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/editor" element={<TemplateEditorScreen />} />
          <Route path="/editor/:id" element={<TemplateEditorScreen />} />
          <Route path="/generate/:id" element={<GeneratorScreen />} />
          <Route path="/email/:id" element={<EmailApplyScreen />} />
          <Route path="/history" element={<HistoryScreen />} />
          <Route path="/variables" element={<VariablesScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
