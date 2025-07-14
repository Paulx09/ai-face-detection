import './App.css';
import React, { useRef } from 'react'; // eslint-disable-next-line
import * as tf from '@tensorflow/tfjs'; 
import * as facemesh from '@tensorflow-models/facemesh';
import Webcam from 'react-webcam';
import { drawMesh } from './utilities';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Section for facemesh
  const runFacemesh = async () => {
    const net = await facemesh.load({
      inputResolution: {
        width: 640,
        height: 480,
      },
      scale: 0.8,
    })

    setInterval(() => {
      detect(net);
    }, 500)
  }

  // Section for detection
  const detect = async (net) => {
    if (typeof webcamRef.current !== 'undefined' 
        && webcamRef.current !== null
        && webcamRef.current.video.readyState === 4) 
    {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const face = await net.estimateFaces(video);
      console.log(face);

      const ctx = canvasRef.current.getContext('2d');
      drawMesh(face, ctx, )
    }
  }

  runFacemesh();

  return (
    <div className="App">

      <header className='App-header'>
        {/* Title & description */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: 10,
          color: 'white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          maxWidth: '800px',
          padding: '0 20px'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            margin: '0 0 10px 0',
            background: 'linear-gradient(45deg, #6bf5ffff, #4ECDC4, #45B7D1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 'bold'
          }}>
            🎭 Face AI - Detección Facial en Tiempo Real
          </h1>
          <p style={{
            fontSize: '1.2rem',
            margin: '0',
            opacity: 0.9,
            lineHeight: '1.4'
          }}>
            ¡Experimenta la magia de la inteligencia artificial! 
            Permite el acceso a tu cámara y observa cómo detectamos tu rostro 
            en tiempo real creando una malla facial 3D interactiva.
          </p>
          <p style={{
            fontSize: '1rem',
            margin: '10px 0 0 0',
            opacity: 0.7,
            fontStyle: 'italic'
          }}>
            Powered by TensorFlow.js & React ⚡
          </p>
        </div>
        
        <Webcam ref={webcamRef} style={
          {
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 9,
            width: 640,
            height: 480,
            border: '5px solid #FFFFF0',
            borderRadius: 20,
            marginTop: '120px',
          }
        } />

        <canvas ref= {canvasRef} style={
          {
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 9,
            width: 640,
            height: 480,
            marginTop: '120px',
          }
        }/>

      </header>
    </div>
  );
}

export default App;
