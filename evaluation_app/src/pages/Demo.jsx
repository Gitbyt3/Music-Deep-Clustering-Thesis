import React, { useState, useEffect } from 'react';
import PageNavigation from '../components/nav_button';
import { useSurvey } from '../contexts/SurveyContext.jsx';
import { getNames } from 'country-list';

const Demo = () => {
  const { surveyData, updateSurveyData } = useSurvey();
  const [ formData, setFormData ] = useState({
    gender: '',
    age: '',
    occupation: '',
    nationality: ''
  })

  useEffect(() => {
    if (surveyData.Demo) {
      setFormData(surveyData.Demo)}
  }, [surveyData])

  console.log('Current form data:', formData)

  const ageRanges = [
    { value: 'Under 18', label: 'Under 18'},
    { value: '18-24', label: '18-24'},
    { value: '25-34', label: '25-34'},
    { value: '35-44', label: '35-44'},
    { value: '45-54', label: '45-54'},
    { value: '55-64', label: '55-64'},
    { value: '65+', label: '65+'}
  ]

  const occupationRanges = [
    { value: 'At school', label: 'At school'},
    { value: 'At university', label: 'At university'},
    { value: 'Full-time employed', label: 'Full-time employed'},
    { value: 'Part-time employed', label: 'Part-time employed'},
    { value: 'Self employed', label: 'Self employed'},
    { value: 'Full-time parent', label: 'Full-time parent'},
    { value: 'Retired', label: 'Retired'},
    { value: 'Other', label: 'Other'}
  ]

  const countries = getNames().sort().map(country => ({
    value: country, label: country
  }))

  const genders = [
    { value: 'Male', label: 'Male'},
    { value: 'Female', label: 'Female'},
    { value: 'Non-binary', label: 'Non-binary'},
    { value: 'Transgender', label: 'Transgender'},
    { value: 'Agender', label: 'Agender'},
    { value: 'Prefer not to say', label: 'Prefer not to say'}
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({...formData, [name]: value})
  };

  const isFormComplete = () => {
    return (
      formData.gender &&
      formData.age &&
      formData.occupation &&
      formData.nationality
    )
  }

  return (
    <div>
        <div style={{paddingLeft:'40px'}}>
            <h3>Demographic Questions</h3>
            <p>This section is designed to gather basic demographic data and will not be linked to any identifiable personal data such as names, emails or phone numbers.</p>
            <p>Please fill out all the options before moving to the next page!</p>
            <br />
            <div>
              <label>
                <strong>Gender:</strong>
                <select name="gender" value={formData.gender} onChange={handleInputChange} style={{marginLeft: '10px'}}>
                  <option value="">Select gender</option>
                  {genders.map((gender) => (
                    <option key={gender.value} value={gender.value}>
                      {gender.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <br/>
            <div>
              <label>
                <strong>Age:</strong>
                <select name="age" value={formData.age} onChange={handleInputChange} style={{marginLeft: '10px'}}>
                  <option value="">Select age range</option>
                  {ageRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <br/>
            <div>
              <label>
                <strong>Occupation:</strong>
                <select name="occupation" value={formData.occupation} onChange={handleInputChange} style={{marginLeft: '10px'}}>
                  <option value="">Select occupation</option>
                  {occupationRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <br/>
            <div>
              <label>
                <strong>Nationality:</strong>
                <select name="nationality" value={formData.nationality} onChange={handleInputChange} style={{marginLeft: '10px'}}>
                  <option value="">Select nationality</option>
                  {countries.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
        </div>
        <PageNavigation onNavigate={() => updateSurveyData('Demo', formData)} nextDisabled={!isFormComplete()}/>
    </div>
  )
}

export default Demo