import React from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import 'tachyons';
import './components/Logo/Logo.css'

// const app = new Clarifai.App({
//   apiKey: '8b9b7396a5904eceba280345b0195a1c'
//  });

const particlesOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      imageUrl: '',
    }
  }

  onButtonSubmit = () => {
    console.log(this.state.imageUrl)
  }
  
  onInputChange = (event) => {
    this.setState({imageUrl: event.target.value})
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />


      {/* 
          <Navigation />
          <Logo />
          <ImageLinkForm />
          <FaceReognition /> 
      */}
        <p>Brain icon made by SmashIcons from www.flaticon.com</p>
      </div>
    );
  }
}

export default App;
