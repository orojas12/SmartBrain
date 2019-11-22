import React from 'react';

const Navigation = ({ isSignedIn, signOut, willRegister, willSignIn }) => {
  if (isSignedIn) {
    return (
      <nav style={{display: 'flex', justifyContent:'flex-end'}}>
        <p className='f3 link dim black underline pa3 pointer' onClick={signOut} >Sign Out</p>
      </nav>
    );      
  } else {
    return (
      <nav style={{display: 'flex', justifyContent:'flex-end'}}>
        <p className='f3 link dim black underline pa3 pointer' onClick={willSignIn} >Sign In</p>
        <p className='f3 link dim black underline pa3 pointer' onClick={willRegister} >Register</p>
      </nav>
    )    
  }
}

export default Navigation;