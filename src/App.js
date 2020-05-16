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
      willRegister: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
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
    app.models
      .predict(
        "a403429f2ddf4b49b307e318f00e528b", 
        this.state.imageUrl
      )
      .then(response => {
        if (response) {
          fetch('http://localhost:3001/image', 
            {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(
                {
                  id: this.state.user.id
                }
              )
            }
          )
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count}))
          })
        }
        this.drawFaceBox(this.calculateFace(response))
      })
      .catch(err => console.log(err))
  }
  
  onInputChange = (event) => {
    this.setState({imageUrl: event.target.value});
  }

  register = () => {
    this.signIn(); //this is temporary until user account creation is added
  }

  willRegister = () => {
    this.setState({willRegister: true});
  }

  willSignIn = () => {
    this.setState({willRegister: false})
  }

  signIn = () => {
    this.setState({
      willRegister: false, 
      isSignedIn: true //this is temporary until user authentication is added
    }); 
  }

  signOut = () => {
    this.setState({isSignedIn: false});
  }

  render() {
    let content;
    if (this.state.isSignedIn === true) {
      content = 
        <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition imageUrl={this.state.imageUrl} faceBox={this.state.faceBox} />
        </div>
    } else if (this.state.willRegister === true) {
        content = 
          <div>
            <Register loadUser={this.loadUser} signIn={this.signIn} />
          </div>
    } else {
        content =
          <div>
            <SignIn willRegister={this.willRegister} loadUser={this.loadUser} signIn={this.signIn} />
          </div>
    }
  
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions} />
        <Navigation 
          isSignedIn={this.state.isSignedIn} 
          signOut={this.signOut} 
          willRegister={this.willRegister} 
          willSignIn={this.willSignIn} 
        />
        {content}

        <p>Brain icon made by SmashIcons from www.flaticon.com</p>
      </div>
    );
  }
}

export default App;
