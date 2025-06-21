import React, { useState, useEffect } from 'react';
import PageNavigation from '../components/nav_button';
import { useSurvey } from '../contexts/SurveyContext.jsx';

const Music = () => {
  const { surveyData, updateSurveyData } = useSurvey();
  const [ formData, setFormData ] = useState({
    musicAttentive: '',
    musicCasual: '',
    musicPractice: '',
    goodSinger: '',
    songMistakes: '',
    beatRecognition: '',
    tuneRecognition: '',
  })
  
  useEffect(() => {
    if (surveyData.Music) {
      setFormData(surveyData.Music)}
    console.log('Current survey data:', surveyData)}, []);
  console.log('Current form data:', formData)

  const minuteRanges = [
    { value: '0-15 minutes', label: '0-15 minutes'},
    { value: '15-30 minutes', label: '15-30 minutes'},
    { value: '30-60 minutes', label: '30-60 minutes'},
    { value: '1-2 hours', label: '1-2 hours'},
    { value: '2-4 hours', label: '2-4 hours'},
    { value: '4+ hours', label: '4+ hours'}
  ]

  const yearRanges = [
    { value: '0-1 years', label: '0-1 years'},
    { value: '1-2 years', label: '1-2 years'},
    { value: '2-4 years', label: '2-4 years'},
    { value: '4-6 years', label: '4-6 years'},
    { value: '6-10 years', label: '6-10 years'},
    { value: '10+ years', label: '10+ years'}
  ]

  const agreeDisagree = [
    { value: 'Strongly Disagree', label: 'Strongly Disagree'},
    { value: 'Mostly Disagree', label: 'Mostly Disagree'},
    { value: 'Neither Agree or Disagree', label: 'Neither Agree or Disagree'},
    { value: 'Mostly Agree', label: 'Mostly Agree'},
    { value: 'Strongly Agree', label: 'Strongly Agree'},
  ]

  const handleSelection = (name, value) => {
    setFormData({...formData, [name]: value})
  }

  const isFormComplete = () => {
    return (
      formData.musicAttentive &&
      formData.musicCasual &&
      formData.musicPractice &&
      formData.goodSinger &&
      formData.songMistakes &&
      formData.beatRecognition &&
      formData.tuneRecognition
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
        
        <h2>Music Listening Questions</h2>
        <p>This section is designed to get a better understanding of your music listening habits and how you experience music.</p>
        <p>Please fill out the form below based on your music listening experience</p>
        <br/>

        <div>
          <h3>1. I listen to music attentively ... a day.</h3>
          <p style={{fontStyle: 'italic'}}>(The main activity and focus is listening to music)</p>
          <div style={buttonGroupStyle}>
            {minuteRanges.map((range) => (
              <button key={range.value} onClick={() => handleSelection('musicAttentive', range.value)} style={buttonStyle('musicAttentive', range.value)}>
                {range.label}
              </button>
            ))}
          </div>
        </div>
        <br/>

        <div>
          <h3>2. I listen to music casually ... a day.</h3>
          <p style={{fontStyle: 'italic'}}>(The main activity is not the music itself but is played in the background whilst the main activity is being done)</p>
          <div style={buttonGroupStyle}>
            {minuteRanges.map((range) => (
              <button key={range.value} onClick={() => handleSelection('musicCasual', range.value)} style={buttonStyle('musicCasual', range.value)}>
                {range.label}
              </button>
            ))}
          </div>
        </div>
        <br/>

        <div>
          <h3>3. I engage in regular, daily practice of a musical instrument (including voice) for the following number of years.</h3>
          <div style={buttonGroupStyle}>
            {yearRanges.map((range) => (
              <button key={range.value} onClick={() => handleSelection('musicPractice', range.value)} style={buttonStyle('musicPractice', range.value)}>
                {range.label}
              </button>
            ))}
          </div>
        </div>
        <br/>

        <div>
          <h3>4. I am able to judge whether someone is a good singer or not.</h3>
          <div style={buttonGroupStyle}>
            {agreeDisagree.map((range) => (
              <button key={range.value} onClick={() => handleSelection('goodSinger', range.value)} style={buttonStyle('goodSinger', range.value)}>
                {range.label}
              </button>
            ))}
          </div>
        </div>
        <br/>

        <div>
          <h3>5. I find it difficult to spot mistakes in a performance of a song even if I know the tune.</h3>
          <div style={buttonGroupStyle}>
            {agreeDisagree.map((range) => (
              <button key={range.value} onClick={() => handleSelection('songMistakes', range.value)} style={buttonStyle('songMistakes', range.value)}>
                {range.label}
              </button>
            ))}
          </div>
        </div>
        <br/>

        <div>
          <h3>6. I can tell when people sing or play out of time to the beat.</h3>
          <div style={buttonGroupStyle}>
            {agreeDisagree.map((range) => (
              <button key={range.value} onClick={() => handleSelection('beatRecognition', range.value)} style={buttonStyle('beatRecognition', range.value)}>
                {range.label}
              </button>
            ))}
          </div>
        </div>
        <br/>

        <div>
          <h3>7. I can tell when people sing or play out of tune.</h3>
          <div style={buttonGroupStyle}>
            {agreeDisagree.map((range) => (
              <button key={range.value} onClick={() => handleSelection('tuneRecognition', range.value)} style={buttonStyle('tuneRecognition', range.value)}>
                {range.label}
              </button>
            ))}
          </div>
        </div>
        <br/>

        <br/>
      </div>

      <PageNavigation onNavigate={() => updateSurveyData('Music', formData)} nextDisabled={!isFormComplete()}/>
    </div>
  )
}

export default Music