import React, {useState, useEffect} from 'react';
import 'rbx/index.css';
import { Button, Container, Title, Message} from 'rbx';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import CourseList, {addScheduleTimes} from './components/CourseList';

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCHFbEjLzpDA2ZPGJ1r1h9DuwqwTcmm8P0",
  authDomain: "coursescheduler-dc71a.firebaseapp.com",
  databaseURL: "https://coursescheduler-dc71a.firebaseio.com",
  projectId: "coursescheduler-dc71a",
  storageBucket: "coursescheduler-dc71a.appspot.com",
  messagingSenderId: "1021035292620",
  appId: "1:1021035292620:web:fe4fe22d33a6647df39f69",
  measurementId: "G-859JYS99L2"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();

// UI Config of authentication component
const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};

const saveCourse = (course, meets) => {
  db.child('courses').child(course.id).update({meets})
    .catch(error => alert(error));
}

const Banner = ({user, title}) => (
  <React.Fragment>
    {user ? <Welcome user={user} /> : <SignIn />}
    <Title>{ title || '[loading...]'}</Title>
  </React.Fragment>
);

const SignIn = () => (
  <StyledFirebaseAuth
    uiConfig={uiConfig}
    firebaseAuth={firebase.auth()}
  />
);

const Welcome=({user}) => (
  <Message color="info">
    <Message.Header>
      Welcome, {user.displayName}
      <Button primary onClick={()=> firebase.auth().signOut()}>
        Log out
      </Button>
    </Message.Header>
  </Message>
);

const App = () =>  {
  const [schedule, setSchedule] = useState({title: '', courses: []});
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleData = snap => {
      if(snap.val()) setSchedule(addScheduleTimes(snap.val()));
    };
    db.on('value', handleData, error => alert(error));
    return () => {db.off('value', handleData);};
  },[]);

  useEffect(()=>{
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  return(
    <Container>
      <Banner title={ schedule.title } user={user}/>
      <CourseList courses={ schedule.courses } user={user} />
    </Container>
  );
};

export default App;
export {saveCourse};