import React, { useState, useEffect } from 'react';
import PageNavigation from '../components/nav_button';
import { useSurvey } from '../contexts/SurveyContext.jsx';
import { database } from '../../firebase.js';
import { ref, set } from 'firebase/database';

const Outro = () => {

  const { surveyData } = useSurvey();
  useEffect(() => {
    console.log('Current survey data:', surveyData)
    const sendSurveyData = async () => {
      try {
        const surveyRef = ref(database, 'surveys/' + Date.now());
        await set(surveyRef, surveyData)
        console.log('Survey data saved succcessfully')
      } catch (error) {
        console.error('Error saving survey data.')
      }
    }
    sendSurveyData()}, [surveyData])

    

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Thank you for taking part in this survey and evaluation!</h2>
      <h3 style={{ fontWeight:'normal' }}>Your participation has been greatly appreciated and your responses have been recorded.</h3>
      <h3 style={{ fontWeight:'normal' }}>Have a great day!</h3>
    </div>
  )
}

export default Outro