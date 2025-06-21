import React, { useState, useEffect } from 'react';
import PageNavigation from '../components/nav_button';
import { useSurvey } from '../contexts/SurveyContext.jsx';
import Axis2D from '../components/arousal_valence_grid.jsx';
import avImage from '../assets/Two-dimensional-valence-arousal-space.png';
import axios from 'axios';

const Input2 = () => {
  const { surveyData, updateSurveyData } = useSurvey();
  const [ formData, setFormData ] = useState({
    arousal: '',
    valence: '',
  })

  useEffect(() => {
    if (surveyData.Input2) {
      setFormData(surveyData.Input2)}
    console.log('Current survey data:', surveyData)}, []);
  console.log('Current form data:', formData)

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePointSelect = (point) => {
    setFormData({...point, arousal:point.arousal, valence:point.valence})
    setError(null)
  }

  const handleNextPage = async () => {
    if (!isFormComplete()) {
      setError('Please select a point on the grid');
      return;
    }
    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.post('http://localhost:5000/api/find-tracks',
        {arousal: formData.arousal, valence: formData.valence},
        {headers: {'Content-Type':'application/json'}})
        
      updateSurveyData('Input2', formData)
      updateSurveyData('Results2', {closest_centroid:response.data.closest_centroid, tracks:response.data.tracks})
      return Promise.resolve()
    }

    catch (err) {
      setError(err.response?.data?.message || 'Failed to get recommendations')
      console.error('API Error', err)
      return Promise.reject(err)
    }

    finally {
      setIsLoading(false)
    }
  }

  const isFormComplete = () => {
    return formData.arousal !== '' && formData.valence !== ''
  }

  return (
    <div>
      <h1 style={{paddingLeft:'40px'}}>Arousal-Valence Input #2</h1>
      <p style={{fontWeight:'bold', paddingLeft:'40px'}}>When you’re ready, please repeat the process one more time. Try to select a different section of the arousal-valence grid!</p>
      <ul>
        <li>You will then be shown 5 film music tracks ranked in order of decreasing relevance (the first result is the most relevant and the last result is the least relevant).</li>
        <br />
        <li>Each of these tracks will have details related to the track such as the film, composer, and release date.</li>
        <br />
        <li>You will also be able to listen to snippets of each of these tracks via a clickable button.</li>
        <br />
        <li>The chart on the left is for your reference.</li>
      </ul>

      {error && (
        <div style={{ color: 'red', textAlign: 'center', margin: '10px' }}>
          {error}
        </div>
      )}

      <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'40px'}}>
        <div style={{flex:1, textAlign:'center'}}>
          <img src={avImage} style={{maxWidth:'100%', height:'auto', maxHeight:'500px'}} />
        </div>
        <div style={{flex:1}}>
          <Axis2D onSelectPoint={handlePointSelect} width={500} height={500} initialPoint={surveyData.Input2}/>
        </div>
      </div>
      <PageNavigation onNavigate={handleNextPage} isLoading={isLoading} nextDisabled={!isFormComplete()}/>
    </div>
  )
}

export default Input2