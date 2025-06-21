import React, { useState, useEffect } from 'react';
import PageNavigation from '../components/nav_button';
import { useSurvey } from '../contexts/SurveyContext.jsx';
import TrackResults from '../components/music_player';
import avImage from '../assets/Two-dimensional-valence-arousal-space.png';

const Output2 = () => {

  const { surveyData, updateSurveyData } = useSurvey();

  const trackData = surveyData['Results2']
  console.log("Tracks:", trackData)

  const [ formData, setFormData] = useState({
    emotionalRelevance: '',
    emotionalSimilarity: '',
    avSimilarity: '',
    orderRelevance: '',
    songRecognition: '',
    suggestions: ''
  })

  useEffect(() => {
    if (surveyData.Output2) {
      setFormData(surveyData.Output2)}
    console.log('Current survey data:', surveyData)}, []);

  const agreeDisagree = [
    { value: 'Strongly Disagree', label: 'Strongly Disagree'},
    { value: 'Mostly Disagree', label: 'Mostly Disagree'},
    { value: 'Neither Agree or Disagree', label: 'Neither Agree or Disagree'},
    { value: 'Mostly Agree', label: 'Mostly Agree'},
    { value: 'Strongly Agree', label: 'Strongly Agree'},
  ]

  const noSongs = [
    { value: '0', label: '0'},
    { value: '1', label: '1'},
    { value: '2', label: '2'},
    { value: '3', label: '3'},
    { value: '4', label: '4'},
    { value: '5', label: '5'}
  ]

  const isFormComplete = () => {
    return (
      formData.emotionalRelevance &&
      formData.emotionalSimilarity &&
      formData.avSimilarity &&
      formData.orderRelevance &&
      formData.songRecognition
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

  console.log('Form Data:', formData)

  return (
    <div>
      <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'40px'}}>
        <div>
          <img src={avImage} style={{maxWidth:'70%', height:'auto', maxHeight:'500px'}} />
        </div>
        <div>
          <h2>Arousal-Valence Output #2</h2>
          <h2 style={{fontWeight:'normal'}}>(Arousal, Valence) → <strong>({surveyData['Input2']['arousal']}, {surveyData['Input2']['valence']})</strong></h2>
        </div>
      </div>
      <TrackResults data={trackData} />
      <br />

      <div style={{paddingLeft:'40px'}}>
        <h2>Questions About Recommended Tracks</h2>
        <p>Below are some questions related to the quality and accuracy of the results. Please answer these as honestly and accurately as possible.</p>
        <br />

        <div>
          <h3>1. How many songs were emotionally relevant to the arousal-valence score I entered?</h3>
          <div style={buttonGroupStyle}>
            {noSongs.map((number) => (
              <button key={number.value} onClick={() => setFormData({...formData, emotionalRelevance:number.value})} style={buttonStyle('emotionalRelevance', number.value)}>
                {number.label}
              </button>
            ))}
          </div>
          <br />
        </div>

        <div>
          <h3>2. The songs shown to me were emotionally similar to each other.</h3>
          <div style={buttonGroupStyle}>
            {agreeDisagree.map((range) => (
              <button key={range.value} onClick={() => setFormData({...formData, emotionalSimilarity:range.value})} style={buttonStyle('emotionalSimilarity', range.value)}>
                {range.label}
              </button>
            ))}
          </div>
          <br />
        </div>

        <div>
          <h3>3. The songs shown to me were emotionally similar to the arousal-valence score I entered.</h3>
          <div style={buttonGroupStyle}>
            {agreeDisagree.map((range) => (
              <button key={range.value} onClick={() => setFormData({...formData, avSimilarity:range.value})} style={buttonStyle('avSimilarity', range.value)}>
                {range.label}
              </button>
            ))}
          </div>
          <br />
        </div>

        <div>
          <h3>4. The order of songs decreased in relevance to the arousal-valence score I entered.</h3>
          <div style={buttonGroupStyle}>
            {agreeDisagree.map((range) => (
              <button key={range.value} onClick={() => setFormData({...formData, orderRelevance:range.value})} style={buttonStyle('orderRelevance', range.value)}>
                {range.label}
              </button>
            ))}
          </div>
          <br />
        </div>

        <div>
          <h3>5. I recognise the songs shown to me.</h3>
          <div style={buttonGroupStyle}>
            {agreeDisagree.map((range) => (
              <button key={range.value} onClick={() => setFormData({...formData, songRecognition:range.value})} style={buttonStyle('songRecognition', range.value)}>
                {range.label}
              </button>
            ))}
          </div>
          <br />
        </div>

        <div>
          <h3>6. (Optional) Please write down any constructive feedback you like!</h3>
          <textarea onChange={(e) => setFormData({...formData, suggestions:e.target.value})} style={{width:'100%', minHeight:'100px', padding:'8px', boxSizing:'border-box'}} />
          <br />
        </div>

      </div>

      <PageNavigation onNavigate={() => updateSurveyData('Output2', formData)} nextDisabled={!isFormComplete()}/>
    </div>
  )
}

export default Output2