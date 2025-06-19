import { createContext, useContext, useState } from 'react';

const SurveyContext = createContext();

export const SurveyProvider = ({ children }) => {
  const [surveyData, setSurveyData] = useState({
    Demo: {},
    Music: {},
    Emotion: {},
    Input1: {},
    Output1: {},
    Input2: {},
    Output2: {},
  });

  const updateSurveyData = (page, data) => {
    setSurveyData(prev => ({ ...prev, [page]: data }));
  };

  return (
    <SurveyContext.Provider value={{ surveyData, updateSurveyData }}>
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => useContext(SurveyContext);