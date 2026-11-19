import React from 'react';
import { LandingPage } from './pages/LandingPage';

export default function App(): React.ReactElement {
  return <LandingPage onSelectLesson={(id) => console.log('Selected lesson:', id)} />;
}
