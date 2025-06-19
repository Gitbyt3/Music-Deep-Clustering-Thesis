import React, { useState, useEffect } from 'react';
import PageNavigation from '../components/nav_button';
import { useSurvey } from '../contexts/SurveyContext.jsx';
import Axis2D from '../components/arousal_valence_grid.jsx';
import avImage from '../assets/Two-dimensional-valence-arousal-space.png';

const Input1 = () => {
  const { surveyData, updateSurveyData } = useSurvey();
  const [ formData, setFormData ] = useState({
    arousal: '',
    valence: ''
  })

  const handlePointSelect = (point) => {
    setFormData({...point, arousal:point.arousal, valence:point.valence})
  }

  useEffect(() => {console.log('Current survey data:', surveyData)}, []);
  console.log('Current form data:', formData)

  return (
    <div>
      <h1 style={{paddingLeft:'40px'}}>Arousal-Valence Input</h1>
      <ul>
        <li>Please select a point on the Arousal-Valence diagram on the right.</li>
        <br />
        <li>The chart on the left is for your reference.</li>
      </ul>

      <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'40px'}}>
        <div style={{flex:1, textAlign:'center'}}>
          <img src={avImage} style={{maxWidth:'100%', height:'auto', maxHeight:'500px'}} />
        </div>
        <div style={{flex:1}}>
          <Axis2D onSelectPoint={handlePointSelect} width={500} height={500} />
        </div>
      </div>
      <PageNavigation />
    </div>
  )
}

export default Input1

