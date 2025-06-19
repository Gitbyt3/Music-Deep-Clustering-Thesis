import React from 'react'
import QMLogo from '../assets/Queen-Mary-logo.png'
import PageNavigation from '../components/nav_button';

const Intro = () => {
  return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
          <img src={QMLogo} style={{maxWidth:'30%', height:'auto', margin:'0 auto', display:'block'}}></img>
          <br /><br />
          <h2>Thank you for agreeing to take part in this survey and film music system evaluation!</h2>
          <br />
          <p>This form will take approximately 15 minutes to complete and your participation is greatly appreciated. No identifiable data will be retained after the survey is complete, only the answers you put down in the next sections. This first section is a basic survey designed to gather demographic data and data related to how you experience music. Please answer the questions as accurately and honestly as possible.
          </p>
          <p>Should you wish to back out of this survey at any point, you may simply close the browser tab and no data will be retained.</p>
          <p>Please press the next button to proceed with the survey.</p>
          <PageNavigation />
      </div>
  )
}

export default Intro