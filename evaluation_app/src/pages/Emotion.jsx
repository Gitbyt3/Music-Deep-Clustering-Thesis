import React, { useState, useEffect } from 'react';
import PageNavigation from '../components/nav_button';
import { useSurvey } from '../contexts/SurveyContext.jsx';

const Emotion = () => {
  const { surveyData, updateSurveyData } = useSurvey();
  const [ formData, setFormData ] = useState({
    musicImportance: 5,
    freeTime: '',
    newMusic: '',
    musicEmotion: '',
    emotionPast: '',
    musicExcite: '',
    emotionTalk: ''
  })

  useEffect(() => {
    if (surveyData.Emotion) {
      setFormData(surveyData.Emotion)}
    else {
      setFormData({
        musicImportance: '5',
        freeTime: '',
        newMusic: '',
        musicEmotion: '',
        emotionPast: '',
        musicExcite: '',
        emotionTalk: ''
      })
    }
    console.log('Current survey data:', surveyData)}, [surveyData]);
  console.log('Current form data:', formData)

  const agreeDisagree = [
    { value: 'Strongly Disagree', label: 'Strongly Disagree'},
    { value: 'Mostly Disagree', label: 'Mostly Disagree'},
    { value: 'Neither Agree or Disagree', label: 'Neither Agree or Disagree'},
    { value: 'Mostly Agree', label: 'Mostly Agree'},
    { value: 'Strongly Agree', label: 'Strongly Agree'},
  ]

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value, 10)
    setFormData({...formData, musicImportance:value})
  }

  const handleSelection = (name, value) => {
    setFormData({...formData, [name]: value})
  }

  const isFormComplete = () => {
    return (
      formData.musicImportance &&
      formData.freeTime &&
      formData.newMusic &&
      formData.musicEmotion &&
      formData.emotionPast &&
      formData.musicExcite &&
      formData.emotionTalk
    )
  }

  const buttonStyle = (name, value) => ({
    padding: '10px 15px',
    backgroundColor: formData[name] === value ? '#007bff' : '#f0f0f0',
    color: formData[name] === value ? 'white' : 'black',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '5px',
    flex: '1 0 auto',
    minWidth: '120px'
  });

  const buttonGroupStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    margin: '15px 0'
  };

  return (
    <div>
      <div style={{paddingLeft:'40px'}}>

        <h3>Emotion and Music Questions</h3>
        <p>This section is designed to assess how intertwined emotion is with your music listening habits.</p>
        <p>Please fill out the form below based on your emotional connection with music</p>
        <br/>

        <div>
          <h3>1. Music is very important to me</h3>
          <p style={{fontStyle: 'italic'}}>(0 = Not important at all, 10 = Extremely important)</p>
          <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
            <span style={{ width: '30px', textAlign: 'center' }}>0</span>
            <input type="range" min="0" max="10" value={formData.musicImportance || 5} onChange={handleSliderChange} style={{ flex:1, height:'8px'}}></input>
            <span style={{ width: '30px', textAlign: 'center' }}>10</span>
          </div>
          <div style={{display:'flex', justifyContent:'center', margin:'20px 0'}}>
            <div style={{width: '50px', height: '50px', borderRadius: '50%', background: '#007bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold'}}>
              {formData.musicImportance}
            </div>
          </div>
        </div>
        <br/>

        <div>
          <h3>2. I spend a lot of my free time doing music-related activities.</h3>
          <div style={buttonGroupStyle}>
            {agreeDisagree.map((range) => (
              <button key={range.value} onClick={() => handleSelection('freeTime', range.value)} style={buttonStyle('freeTime', range.value)}>
                {range.label}
              </button>
            ))}
          </div>
        </div>
        <br/>

        <div>
          <h3>3. I keep track of new music that I come across.</h3>
          <div style={buttonGroupStyle}>
            {agreeDisagree.map((range) => (
              <button key={range.value} onClick={() => handleSelection('newMusic', range.value)} style={buttonStyle('newMusic', range.value)}>
                {range.label}
              </button>
            ))}
          </div>
        </div>
        <br/>

        <div>
          <h3>4. Pieces of music rarely evoke emotions for me.</h3>
          <div style={buttonGroupStyle}>
            {agreeDisagree.map((range) => (
              <button key={range.value} onClick={() => handleSelection('musicEmotion', range.value)} style={buttonStyle('musicEmotion', range.value)}>
                {range.label}
              </button>
            ))}
          </div>
        </div>
        <br/>

        <div>
          <h3>5. Music can evoke my memories of past people and places.</h3>
          <div style={buttonGroupStyle}>
            {agreeDisagree.map((range) => (
              <button key={range.value} onClick={() => handleSelection('emotionPast', range.value)} style={buttonStyle('emotionPast', range.value)}>
                {range.label}
              </button>
            ))}
          </div>
        </div>
        <br/>

        <div>
          <h3>6. I often pick certain music to motivate or excite me.</h3>
          <div style={buttonGroupStyle}>
            {agreeDisagree.map((range) => (
              <button key={range.value} onClick={() => handleSelection('musicExcite', range.value)} style={buttonStyle('musicExcite', range.value)}>
                {range.label}
              </button>
            ))}
          </div>
        </div>
        <br/>

        <div>
          <h3>7. I am able to talk about the emotions that a piece of music evokes for me.</h3>
          <div style={buttonGroupStyle}>
            {agreeDisagree.map((range) => (
              <button key={range.value} onClick={() => handleSelection('emotionTalk', range.value)} style={buttonStyle('emotionTalk', range.value)}>
                {range.label}
              </button>
            ))}
          </div>
        </div>
        <br/>

      </div>

      <PageNavigation onNavigate={() => updateSurveyData('Emotion', formData)} nextDisabled={!isFormComplete()}/>
    </div>
  )
}

export default Emotion