import React, { useState, useEffect } from 'react';
import PageNavigation from '../components/nav_button';
import { useSurvey } from '../contexts/SurveyContext.jsx';
import avImage from '../assets/Two-dimensional-valence-arousal-space.png';

const Outline = () => {
  return (
    <div style={{ padding: '20px' }}>
        <h1 style={{ textAlign:'center' }}>System Outline</h1>
        <ul>
            <li>The purpose of this section is to evaluate a program designed to identify film music most closely related to an emotion.</li>
            <br/>
            <li>You will be shown a grid labelled with the axes <b>Arousal</b> and <b>Valence</b>.</li>
            <br/>
            <li><b>Arousal</b> is on the vertical axis and refers to the intensity of the emotion.</li>
            <br/>
            <li><b>Valence</b> is on the horizontal axis and refers to the extent to which the emotion is positive or negative.</li>
            <br/>
            <li>Some sample emotions are labelled in the figure below according to the specific arousal-valence combination.</li>
        </ul>
        <img src={avImage} style={{maxWidth:'30%', height:'auto', margin:'0 auto', display:'block'}} />
        <PageNavigation />
    </div>

  )
}

export default Outline