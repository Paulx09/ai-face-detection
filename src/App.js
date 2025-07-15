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

      const videoElement = webcamRef.current.video;
      const displayWidth = videoElement.clientWidth;
      const displayHeight = videoElement.clientHeight;

      canvasRef.current.width = displayWidth;
      canvasRef.current.height = displayHeight;

      const face = await net.estimateFaces(video);
      
      if (face.length > 0) {
        const ctx = canvasRef.current.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, displayWidth, displayHeight);
        
        const scaleX = displayWidth / videoWidth;
        const scaleY = displayHeight / videoHeight;
        
        const scaledFace = face.map(prediction => ({
          ...prediction,
          scaledMesh: prediction.scaledMesh.map(point => [
            point[0] * scaleX,
            point[1] * scaleY,
            point[2]
          ])
        }));
        
        drawMesh(scaledFace, ctx);
      }
    }
  }

  runFacemesh();

  return (
    <div className="App">
      <header className='App-header' style={{
        minHeight: '100vh',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Title & description - Responsive */}
        <div style={{
          textAlign: 'center',
          zIndex: 10,
          color: 'white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          maxWidth: '90vw',
          padding: '0 20px',
          marginBottom: 'clamp(20px, 4vh, 40px)'
        }}>
          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            margin: '0 0 10px 0',
            background: 'linear-gradient(45deg, #6bf5ffff, #4ECDC4, #45B7D1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 'bold',
            lineHeight: '1.2'
          }}>
            🎭 Face AI - Detección Facial
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            margin: '0',
            opacity: 0.9,
            lineHeight: '1.4',
            maxWidth: '600px'
          }}>
            ¡Experimenta la magia de la inteligencia artificial! 
            Permite el acceso a tu cámara y observa cómo detectamos tu rostro 
            en tiempo real creando una malla facial 3D interactiva.
          </p>
          <p style={{
            fontSize: 'clamp(0.8rem, 2vw, 1rem)',
            margin: '10px 0 0 0',
            opacity: 0.7,
            fontStyle: 'italic'
          }}>
            Powered by TensorFlow.js & React ⚡
          </p>
        </div>
        
        {/* Video Container - Responsive */}
        <div style={{
          position: 'relative',
          width: 'min(90vw, 640px)',
          height: 'min(67.5vw, 480px)',
          maxWidth: '640px',
          maxHeight: '480px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Webcam 
            ref={webcamRef} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              border: '5px solid #FFFFF0',
              borderRadius: 'clamp(10px, 2vw, 20px)',
              zIndex: 9
            }} 
          />

          <canvas 
            ref={canvasRef} 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 10,
              pointerEvents: 'none'
            }}
          />
        </div>

        {/* Instructions for mobile */}
        <div style={{
          marginTop: 'clamp(15px, 3vh, 25px)',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.6)',
          fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
          maxWidth: '90vw',
          display: window.innerWidth < 768 ? 'block' : 'none'
        }}>
          💡 Consejo: Gira tu dispositivo horizontalmente para una mejor experiencia
        </div>

      </header>
    </div>
  );
}

export default App;
