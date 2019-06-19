import React, { Component } from 'react';
import firebase from 'firebase';

<script src="https://www.gstatic.com/firebasejs/6.2.0/firebase-app.js"></script>

     https://firebase.google.com/docs/web/setup#config-web-app -->



  var firebaseConfig = {
    apiKey: "AIzaSyBdVr0JKCANeWSTHEp9ctN-cwRRvaV3lBM",
    authDomain: "supbank-74286.firebaseapp.com",
    databaseURL: "https://supbank-74286.firebaseio.com",
    projectId: "supbank-74286",
    storageBucket: "supbank-74286.appspot.com",
    messagingSenderId: "592224342320",
    appId: "1:592224342320:web:a7c1a4b07ec3428f"
  };
  
  const fire = firebase.initializeApp(firebaseConfig);
export default fire;