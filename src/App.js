import React from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import 'tachyons';
import './App.css';
import './components/Logo/Logo.css'

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

const initialState = {
    imageFormInput: '',
    imageUrl: '',
    faceBox: {},
    route: 'signin',
    user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: ''
    }
}


class App extends React.Component {
  constructor() {
    super();
    this.state = initialState;
  }

  calculateFace = (data) => {
    const face = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width)
    const height = Number(image.height)
    return {
      leftCol: face.left_col * width,
      topRow: face.top_row * height,
      rightCol: width - (face.right_col * width),
      bottomRow: height - (face.bottom_row * height)
    }
  }

  drawFaceBox = (faceBox) => {
    this.setState({ faceBox })
  }

  onDetectFaceSubmit = () => {
    this.setState({imageUrl: this.state.imageFormInput});
    fetch('http://localhost:3001/imageUrl', 
      {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
          {
            input: this.state.imageFormInput
          }
        )
      }
    )
      .then(response => response.json())
      .then(data => {
        const faceBox = this.calculateFace(data);
        this.drawFaceBox(faceBox);
        return data;
      })
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
          .catch(console.log)
        }
      })
      .catch(err => console.log(err))
  }
  
  onImageFormInput = (event) => {
    this.setState({imageFormInput: event.target.value});
  }

  loadUser = (user) => {
    this.setState({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        entries: user.entries,
        joined: user.joined
      },
      route: 'home'
    })
  }

  register = () => {
    this.setState({route: 'register'})
  }

  signIn = () => {
    this.setState({route: 'signin'})
  }

  signOut = () => {
    this.setState(initialState)
  }

  render() {
    let content = <div>no content</div>;
    if (this.state.route === 'home') {
      content = 
        <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm onImageFormInput={this.onImageFormInput} onDetectFaceSubmit={this.onDetectFaceSubmit} />
            <FaceRecognition imageUrl={this.state.imageUrl} faceBox={this.state.faceBox} />
        </div>
    } else if (this.state.route === 'register') {
        content = 
          <div>
            <Register loadUser={this.loadUser} signIn={this.signIn} />
          </div>
      } else {
          content =
            <div>
              <SignIn loadUser={this.loadUser} register={this.register} />
            </div>
      }
  
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions} />
        <Navigation 
          route={this.state.route}
          signOut={this.signOut} 
          signIn={this.signIn} 
          register={this.register} 
        />
        {content}
        <p>Brain icon made by SmashIcons from www.flaticon.com</p>
      </div>
    );
  }
}

export default App;
