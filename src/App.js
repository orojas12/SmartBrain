import React from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import 'tachyons';
import './components/Logo/Logo.css'

const app = new Clarifai.App({
  apiKey: '8b9b7396a5904eceba280345b0195a1c'
 });

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
      faceBox: {},
      route: 'signin',
      isSignedIn: false,
    }
  }

  calculateFace = (data) => {
    const face = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width)
    const height = Number(image.height)
    console.log(width, height)
    return {
      leftCol: face.left_col * width,
      topRow: face.top_row * height,
      rightCol: width - (face.right_col * width),
      bottomRow: height - (face.bottom_row * height)
    }
  }

  drawFaceBox = (faceBox) => {
    console.log(faceBox)
    this.setState({ faceBox })
  }

  onButtonSubmit = () => {
    console.log(this.state.imageUrl);
    app.models
      .predict(
        "a403429f2ddf4b49b307e318f00e528b", 
        this.state.imageUrl
      )
      .then(response => this.drawFaceBox(this.calculateFace(response)))
      .catch(err => console.log(err));
  }
  
  onInputChange = (event) => {
    this.setState({imageUrl: event.target.value})
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
    this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions} />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
        { this.state.route === 'home'
          ? <div>
              <Logo />
              <Rank />
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
              <FaceRecognition imageUrl={this.state.imageUrl} faceBox={this.state.faceBox} />
            </div>
          : (
            this.state.route === 'signin' 
            ? <SignIn onRouteChange={this.onRouteChange} />
            : <Register onRouteChange={this.onRouteChange} />
          )
            
        }
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
