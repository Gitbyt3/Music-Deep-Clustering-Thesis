import React from 'react';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import { SurveyProvider } from './contexts/SurveyContext'
import MainLayout from './layouts/MainLayout';
import Intro from './pages/Intro';
import Demo from './pages/Demo';
import Music from './pages/Music';
import Emotion from './pages/Emotion';
import Outline from './pages/Outline';
import Input1 from './pages/Input1';
import Output1 from './pages/Output1';
import Input2 from './pages/Input2';
import Output2 from './pages/Output2';
import Outro from './pages/Outro';

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<MainLayout />}>
        <Route index element={<Intro />} />
        <Route path='demo' element={<Demo />} />
        <Route path='music' element={<Music />} />
        <Route path='emotion' element={<Emotion />} />
        <Route path='outline' element={<Outline />} />
        <Route path='input1' element={<Input1 />} />
        <Route path='output1' element={<Output1 />} />
        <Route path='input2' element={<Input2 />} />
        <Route path='output2' element={<Output2 />} />
        <Route path='outro' element={<Outro />} />
      </Route>
    )
  );

  return (
    <SurveyProvider>
      <RouterProvider router={router} />
    </SurveyProvider>
  )
};

export default App