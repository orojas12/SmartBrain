import React from 'react';

const Navigation = ({ route, signOut, signIn, register }) => {
  if (route === 'home') {
    return (
      <nav style={{display: 'flex', justifyContent:'flex-end'}}>
        <p className='f3 link dim black underline pa3 pointer' onClick={signOut} >Sign Out</p>
      </nav>
    );      
  } else {
    return (
      <nav style={{display: 'flex', justifyContent:'flex-end'}}>
        <p className='f3 link dim black underline pa3 pointer' onClick={signIn} >Sign In</p>
        <p className='f3 link dim black underline pa3 pointer' onClick={register} >Register</p>
      </nav>
    )    
  }
}

export default Navigation;