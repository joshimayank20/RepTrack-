import React, { useState, useRef, useEffect, useCallback } from 'react';
import StatusBar from '../components/StatusBar';
import './PostureDetection.css';

import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';

const EXERCISES = [
  {
    id: 'squat',
    name: 'Squat',
    icon: '🦵',
    cue: 'Keep knees aligned'
  },
  {
    id: 'pushup',
    name: 'Push Up',
    icon: '💪',
    cue: 'Keep back straight'
  },
  {
    id: 'curl',
    name: 'Bicep Curl',
    icon: '🏋️',
    cue: 'Control elbow movement'
  },
  {
    id: 'jumpingjack',
    name: 'Jumping Jack',
    icon: '🤸',
    cue: 'Raise arms fully'
  },
  {
    id: 'treepose',
    name: 'Tree Pose',
    icon: '🧘',
    cue: 'Balance on one leg'
  }
];

function calculateAngle(a, b, c) {
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) -
    Math.atan2(a.y - b.y, a.x - b.x);

  let angle = Math.abs((radians * 180.0) / Math.PI);

  if (angle > 180) {
    angle = 360 - angle;
  }

  return angle;
}

export default function PostureDetection({ onNavigate }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const lastVoiceRef = useRef(0);

  const [step, setStep] = useState('select');
  const [selectedEx, setSelectedEx] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [postureScore, setPostureScore] = useState(null);
  const [postureCue, setPostureCue] = useState('');
  const [reps, setReps] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [facingMode, setFacingMode] = useState('user');

  const repState = useRef(false);

  const BONES = [
    [11, 13],
    [13, 15],
    [12, 14],
    [14, 16],
    [11, 12],
    [11, 23],
    [12, 24],
    [23, 24],
    [23, 25],
    [25, 27],
    [24, 26],
    [26, 28]
  ];

  const drawSkeleton = (landmarks) => {
    const canvas = canvasRef.current;

if (!canvas) return;

const ctx = canvas.getContext('2d');

if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle =
  postureScore === 'good'
    ? '#3ddc5c'
    : postureScore === 'warn'
    ? '#f0b429'
    : '#ff4d4d';
    ctx.lineWidth = 3;

    BONES.forEach(([a, b]) => {
      const p1 = landmarks[a];
      const p2 = landmarks[b];

      ctx.beginPath();
      ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
      ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
      ctx.stroke();
    });

    landmarks.forEach((point) => {
      ctx.beginPath();
      ctx.arc(
        point.x * canvas.width,
        point.y * canvas.height,
        5,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
  postureScore === 'good'
    ? '#3ddc5c'
    : postureScore === 'warn'
    ? '#f0b429'
    : '#ff4d4d';
      ctx.fill();
    });
  };
  const speak = (message) => {

    const now = Date.now();
  
    if (now - lastVoiceRef.current < 3000) {
      return;
    }
  
    lastVoiceRef.current = now;
  
    window.speechSynthesis.cancel();
  
    const utterance =
      new SpeechSynthesisUtterance(message);
  
    utterance.rate = 1;
  
    window.speechSynthesis.speak(
      utterance
    );
  };

  const startCamera = useCallback(async (mode) => {
    setCameraError(null);

    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      setCameraError('Camera permission denied');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  useEffect(() => {

    return () => {
  
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach(track => track.stop());
      }
  
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
  
    };
  
  }, []);

  useEffect(() => {
    if (step !== 'detecting' || !selectedEx) return;

    let camera;

    const pose = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    pose.onResults((results) => {
      if (
        !canvasRef.current ||
        !videoRef.current
      ) {
        return;
      }
      if (!results.poseLandmarks) return;

      const lm = results.poseLandmarks;

      drawSkeleton(lm);

      const leftShoulder = lm[11];
const rightShoulder = lm[12];

const leftElbow = lm[13];
const rightElbow = lm[14];

const leftWrist = lm[15];
const rightWrist = lm[16];

const leftHip = lm[23];
const rightHip = lm[24];

const leftKnee = lm[25];
const rightKnee = lm[26];

const leftAnkle = lm[27];
const rightAnkle = lm[28];

const kneeAngle =
(
  calculateAngle(
    leftHip,
    leftKnee,
    leftAnkle
  ) +
  calculateAngle(
    rightHip,
    rightKnee,
    rightAnkle
  )
) / 2;

const elbowAngle =
(
  calculateAngle(
    leftShoulder,
    leftElbow,
    leftWrist
  ) +
  calculateAngle(
    rightShoulder,
    rightElbow,
    rightWrist
  )
) / 2;

const backAngle =
(
  calculateAngle(
    leftShoulder,
    leftHip,
    leftKnee
  ) +
  calculateAngle(
    rightShoulder,
    rightHip,
    rightKnee
  )
) / 2;

      // PUSHUP
      if (selectedEx.id === 'pushup') {

        if (
          elbowAngle < 90 &&
          backAngle > 160
        ) {
      
          setPostureScore('good');
          setPostureCue('Excellent pushup form');
          speak(
            'Correct pushup posture'
          );
      
          if (!repState.current) {
            repState.current = true;
          }
      
        } else if (
          backAngle < 150
        ) {
      
          setPostureScore('warn');
          setPostureCue('Keep your body straight');
          speak(
            'Keep your body straight'
          );
      
        } else {
      
          setPostureScore('warn');
          setPostureCue('Go lower');
        }
      
        if (
          elbowAngle > 150 &&
          repState.current
        ) {
      
          repState.current = false;
          setReps(r => r + 1);
        }
      }

      // SQUAT
      if (selectedEx.id === 'squat') {

        if (
          kneeAngle < 100 &&
          backAngle > 150
        ) {
      
          setPostureScore('good');
          setPostureCue('Perfect squat posture');
          speak(
            'Correct squat posture'
          );
      
          if (!repState.current) {
            repState.current = true;
          }
      
        } else if (
          kneeAngle < 120
        ) {
      
          setPostureScore('warn');
          setPostureCue('Go slightly deeper');
          speak(
            'Squat deeper'
          );
      
        } else {
      
          setPostureScore('bad');
          setPostureCue('Bend knees and lower hips');
          speak(
            'Wrong squat posture'
          );
        }
      
        if (
          kneeAngle > 160 &&
          repState.current
        ) {
      
          repState.current = false;
          setReps(r => r + 1);
        }
      }

      // CURL
      if (selectedEx.id === 'curl') {
        const elbowAngle = calculateAngle(
          leftShoulder,
          leftElbow,
          leftWrist
        );

        if (elbowAngle < 50 && !repState.current) {
          repState.current = true;
          setPostureScore('good');
          setPostureCue('Strong curl');
          speak(
            'Strong curls'
          );
        }

        if (elbowAngle > 140 && repState.current) {
          repState.current = false;
          setReps((r) => r + 1);
        }

        if (elbowAngle > 80) {
          setPostureScore('warn');
          setPostureCue('Curl higher');
        }
      }

      // JUMPING JACK
      if (selectedEx.id === 'jumpingjack') {

        const handsUp =
          leftWrist.y < leftShoulder.y &&
          rightWrist.y < rightShoulder.y;
      
        const feetApart =
          Math.abs(leftAnkle.x - rightAnkle.x) > 0.35;
      
        if (
          handsUp &&
          feetApart &&
          !repState.current
        ) {
      
          repState.current = true;
      
          setPostureScore('good');
          setPostureCue('Excellent Jumping Jack');
          speak(
            'Good jumping jack'
          );
      
        }
      
        if (
          !handsUp &&
          !feetApart &&
          repState.current
        ) {
      
          repState.current = false;
          setReps(r => r + 1);
      
        }
      
        if (
          handsUp &&
          !feetApart
        ) {
      
          setPostureScore('warn');
          setPostureCue('Spread your legs wider');
          speak(
            'Spread your legs wider'
          );
      
        }
      
        else if (
          !handsUp &&
          feetApart
        ) {
      
          setPostureScore('warn');
          setPostureCue('Raise arms higher');
      
        }
      
        else if (
          !handsUp &&
          !feetApart
        ) {
      
          setPostureScore('bad');
          setPostureCue('Start Jumping Jack');
      
        }
      }

      // TREE POSE
      if (selectedEx.id === 'treepose') {

        const legRaised =
          Math.abs(
            leftAnkle.x - rightAnkle.x
          ) > 0.15;
      
        if (
          legRaised &&
          backAngle > 160
        ) {
      
          setPostureScore('good');
          setPostureCue('Excellent balance');
          setPostureCue(
            'Excellent balance'
          );
      
        } else {
      
          setPostureScore('warn');
          setPostureCue('Stand straighter');
      
        }
      }
      
    }); // CLOSE pose.onResults
      
    if (videoRef.current) {
      camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await pose.send({
            image: videoRef.current
          });
        },
        width: 640,
        height: 480
      });

      camera.start();
    }

    timerRef.current = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);

    return () => {
      if (camera) {
        camera.stop();
      }

      clearInterval(timerRef.current);
    };
  }, [step, selectedEx]);

  const handleSelectExercise = async (ex) => {
    setSelectedEx(ex);
    setStep('ready');
    await startCamera(facingMode);
  };

  const handleStart = () => {
    setStep('detecting');
    setReps(0);
    setElapsed(0);
    repState.current = false;
  };

  const handlePause = () => {
    setStep('paused');
  };

  const handleResume = () => {
    setStep('detecting');
  };

  const handleStop = () => {
    stopCamera();

    repState.current = false;

if (videoRef.current) {
  videoRef.current.srcObject = null;
}
window.speechSynthesis.cancel();
    setStep('select');
    setSelectedEx(null);
    setReps(0);
    setElapsed(0);
    setPostureScore(null);
  };

  const handleFlip = async () => {
    const next = facingMode === 'user'
      ? 'environment'
      : 'user';

    setFacingMode(next);

    await startCamera(next);
  };

  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(
      s % 60
    ).padStart(2, '0')}`;

  const scoreColor =
    postureScore === 'good'
      ? '#3ddc5c'
      : postureScore === 'warn'
      ? '#f0b429'
      : '#ff4d4d';

  return (
    <div className="posture-page">
      <StatusBar />

      <div className="page posture-inner">

        <div className="posture-header">
          <button
            className="back-btn"
            onClick={() => {
              stopCamera();
              onNavigate('home');
            }}
          >
            ←
          </button>

          <h2 className="posture-title">Posture AI</h2>

          <div className="posture-badge">
            AI
          </div>
        </div>

        {step === 'select' && (
          <div className="exercise-grid">
            {EXERCISES.map((ex) => (
              <button
                key={ex.id}
                className="ex-card"
                onClick={() => handleSelectExercise(ex)}
              >
                <span className="ex-emoji">
                  {ex.icon}
                </span>

                <span className="ex-name">
                  {ex.name}
                </span>

                <span className="ex-cue">
                  {ex.cue}
                </span>
              </button>
            ))}
          </div>
        )}

        {(step === 'ready' ||
          step === 'detecting' ||
          step === 'paused') && (
          <div className="posture-camera-section">

            <div className="camera-wrap">

              {cameraError ? (
                <div className="camera-error">
                  {cameraError}
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    className="camera-video"
                    muted
                    playsInline
                  />

                  <canvas
                    ref={canvasRef}
                    className="skeleton-canvas"
                    width={640}
                    height={480}
                  />
                </>
              )}

              <button
                className="flip-btn"
                onClick={handleFlip}
              >
                Flip
              </button>
            </div>

            {selectedEx && (
              <div className="ex-label-row">
                <span className="ex-label-icon">
                  {selectedEx.icon}
                </span>

                <span className="ex-label-name">
                  {selectedEx.name}
                </span>
              </div>
            )}

            {postureScore && (
              <div className="score-row">
                <div
                  className="score-badge"
                  style={{
                    borderColor: scoreColor,
                    color: scoreColor
                  }}
                >
                  {postureScore.toUpperCase()}
                </div>

                <p className="score-cue">
                  {postureCue}
                </p>
              </div>
            )}

            <div className="detect-stats">
              <div className="detect-stat">
                <span className="dstat-val">
                  {reps}
                </span>

                <span className="dstat-label">
                  Reps
                </span>
              </div>

              <div className="detect-stat">
                <span className="dstat-val">
                  {fmt(elapsed)}
                </span>

                <span className="dstat-label">
                  Time
                </span>
              </div>
            </div>

            <div className="detect-controls">

              {step === 'ready' && (
                <button
                  className="btn-primary"
                  onClick={handleStart}
                >
                  START
                </button>
              )}

              {step === 'detecting' && (
                <>
                  <button
                    className="btn-outline"
                    onClick={handlePause}
                  >
                    Pause
                  </button>

                  <button
                    className="btn-danger"
                    onClick={handleStop}
                  >
                    Stop
                  </button>
                </>
              )}

              {step === 'paused' && (
                <>
                  <button
                    className="btn-primary"
                    onClick={handleResume}
                  >
                    Resume
                  </button>

                  <button
                    className="btn-danger"
                    onClick={handleStop}
                  >
                    Stop
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}