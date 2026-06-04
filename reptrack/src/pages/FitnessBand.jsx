import React, { useState, useEffect, useRef } from 'react';
import StatusBar from '../components/StatusBar';
import BottomNav from '../components/BottomNav';
import './FitnessBand.css';

const HR_ZONES = [
  { name: 'Rest', min: 50, max: 69, color: '#4aa3ff' },
  { name: 'Fat Burn', min: 70, max: 99, color: '#3ddc5c' },
  { name: 'Cardio', min: 100, max: 139, color: '#f0b429' },
  { name: 'Peak', min: 140, max: 180, color: '#ff4d4d' },
];

function SignalBars({ strength = 4 }) {

  return (
    <div className="signal-bars">

      {[1, 2, 3, 4].map(i => (

        <div
          key={i}
          className={`bar ${i <= strength ? 'active' : ''}`}
          style={{
            height: `${i * 4 + 4}px`
          }}
        />

      ))}

    </div>
  );
}

export default function FitnessBand({
  onNavigate
}) {

  const [view, setView] =
    useState('connect');

  const [devices, setDevices] =
    useState([]);

  const [connectedDevice,
    setConnectedDevice] =
    useState(null);

  const [connecting,
    setConnecting] =
    useState(null);

  const [heartRate,
    setHeartRate] =
    useState(72);

  const [steps,
    setSteps] =
    useState(0);

  const [calories,
    setCalories] =
    useState(0);

  const [distance,
    setDistance] =
    useState(0);

  const [battery,
    setBattery] =
    useState(0);

  const [monitoring,
    setMonitoring] =
    useState(false);

  const [currentZone,
    setCurrentZone] =
    useState(HR_ZONES[0]);

  const [hrHistory,
    setHrHistory] =
    useState([72, 74, 75, 76, 78]);

  const [bluetoothSupported,
    setBluetoothSupported] =
    useState(true);

  const [bleDevice,
    setBleDevice] =
    useState(null);

  const [gattServer,
    setGattServer] =
    useState(null);

  const motionRef =
    useRef(null);

  // BLUETOOTH CHECK
  useEffect(() => {

    if (!navigator.bluetooth) {
      setBluetoothSupported(false);
    }

  }, []);

  // HEART RATE ZONE
  useEffect(() => {

    const zone = HR_ZONES.find(
      z =>
        heartRate >= z.min &&
        heartRate <= z.max
    );

    setCurrentZone(
      zone || HR_ZONES[0]
    );

  }, [heartRate]);

  // STEP TRACKING
  useEffect(() => {

    if (!monitoring) return;

    const handleMotion = (event) => {

      const acc =
        event.accelerationIncludingGravity;

      if (!acc) return;

      const total =
        Math.abs(acc.x || 0) +
        Math.abs(acc.y || 0) +
        Math.abs(acc.z || 0);

      if (total > 25) {

        setSteps(prev => prev + 1);

        setCalories(prev =>
          parseFloat(
            (prev + 0.04).toFixed(2)
          )
        );

        setDistance(prev =>
          parseFloat(
            (prev + 0.0007).toFixed(2)
          )
        );
      }
    };

    window.addEventListener(
      'devicemotion',
      handleMotion
    );

    return () => {

      window.removeEventListener(
        'devicemotion',
        handleMotion
      );
    };

  }, [monitoring]);

  // SCAN
  const startScan = async () => {

    if (!bluetoothSupported) {

      alert(
        'Bluetooth not supported'
      );

      return;
    }

    try {

      setView('scanning');

      const device =
        await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: [
            'heart_rate',
            'battery_service'
          ]
        });

      if (!device) {
        return;
      }

      setDevices([
        {
          id:
            device?.id || 'Unknown',

          name:
            device?.name ||
            'Unknown Fitness Device',

          type: 'band'
        }
      ]);

    } catch (err) {

      console.log(err);

      setView('connect');
    }
  };

  // CONNECT
  const handleConnect =
    async (deviceData) => {

    try {

      setConnecting(
        deviceData?.id
      );

      const device =
        await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: [
            'heart_rate',
            'battery_service'
          ]
        });

      if (!device) {
        return;
      }

      const server =
        await device.gatt.connect();

      setBleDevice(device);

      setGattServer(server);

      setConnectedDevice({
        id:
          device?.id || 'Unknown',

        name:
          device?.name ||
          'Fitness Band',

        type: 'band'
      });

      // HEART RATE
      try {

        const hrService =
          await server.getPrimaryService(
            'heart_rate'
          );

        const hrCharacteristic =
          await hrService.getCharacteristic(
            'heart_rate_measurement'
          );

        await hrCharacteristic.startNotifications();

        hrCharacteristic.addEventListener(
          'characteristicvaluechanged',
          (event) => {

            const value =
              event.target.value;

            const bpm =
              value.getUint8(1);

            setHeartRate(bpm);

            setHrHistory(prev => [
              ...prev.slice(-14),
              bpm
            ]);
          }
        );

      } catch (err) {

        console.log(
          'Heart rate unavailable'
        );
      }

      // BATTERY
      try {

        const batteryService =
          await server.getPrimaryService(
            'battery_service'
          );

        const batteryCharacteristic =
          await batteryService.getCharacteristic(
            'battery_level'
          );

        const batteryValue =
          await batteryCharacteristic.readValue();

        setBattery(
          batteryValue.getUint8(0)
        );

      } catch (err) {

        console.log(
          'Battery unavailable'
        );
      }

      setView('connected');

    } catch (err) {

      console.log(err);

      alert(
        'Could not connect to device'
      );
    }

    setConnecting(null);
  };

  // DISCONNECT
  const handleDisconnect =
    async () => {

    try {

      if (
        bleDevice &&
        bleDevice.gatt &&
        bleDevice.gatt.connected
      ) {

        bleDevice.gatt.disconnect();
      }

    } catch (err) {

      console.log(err);
    }

    setBleDevice(null);

    setGattServer(null);

    setConnectedDevice(null);

    setMonitoring(false);

    setView('connect');
  };

  // START MONITORING
  const handleStartMonitoring = () => {

    setMonitoring(true);

    setView('live');
  };

  const maxHr =
    Math.max(...hrHistory);

  const minHr =
    Math.min(...hrHistory);

  const hrRange =
    maxHr - minHr || 1;

  const hrColor =
    currentZone?.color ||
    '#3ddc5c';

  return (

    <div className="band-page">

      <StatusBar />

      <div className="page band-inner">

        {/* HEADER */}
        <div className="band-header">

          {(view === 'connected' ||
            view === 'live') && (

            <button
              className="back-btn"
              onClick={() =>
                setView('connected')
              }
            >
              ←
            </button>
          )}

          <h2 className="band-title">
            Fitness Band
          </h2>

          {connectedDevice && (

            <div className="connected-chip">

              <span className="connected-dot" />

              Connected

            </div>
          )}

        </div>

        {/* CONNECT */}
        {view === 'connect' && (

          <div className="connect-view">

            <div className="band-hero">

              <div className="band-illustration">

                <div className="pulse-ring" />

              </div>

            </div>

            <h3 className="connect-title">
              Connect Your Fitness Band
            </h3>

            <p className="connect-sub">

              Connect BLE heart-rate devices,
              fitness bands, or smart bands.

              <br /><br />

              Apple Watch requires
              a native iPhone app.

            </p>

            {!bluetoothSupported && (

              <div className="camera-error">

                Bluetooth not supported
                in this browser.

              </div>
            )}

            <div className="feature-chips">

              {[
                '❤️ Heart Rate',
                '👟 Steps',
                '🔥 Calories',
                '📏 Distance'
              ].map(f => (

                <span
                  key={f}
                  className="feature-chip"
                >
                  {f}
                </span>

              ))}

            </div>

            <button
              className="btn-primary scan-btn"
              onClick={startScan}
            >
              Scan for Devices
            </button>

          </div>
        )}

        {/* SCANNING */}
        {view === 'scanning' && (

          <div className="scanning-view">

            <div className="scan-anim">

              <div className="scan-center-dot" />

              <div className="scan-ring r1" />

              <div className="scan-ring r2" />

              <div className="scan-ring r3" />

            </div>

            <p className="scan-title">
              Scanning for devices...
            </p>

            <div className="device-list">

              {devices.map((dev, index) => (

                <div
                  key={dev?.id || index}
                  className="device-item card"
                >

                  <div className="device-icon">

                    {(dev?.type || 'band')
                      === 'watch'
                      ? '⌚'
                      : '📶'}

                  </div>

                  <div className="device-info">

                    <p className="device-name">
                      {dev?.name ||
                        'Unknown Device'}
                    </p>

                    <p className="device-mac">
                      {dev?.id || 'No ID'}
                    </p>

                  </div>

                  <SignalBars strength={4} />

                  <button
                    className="pair-btn"
                    onClick={() =>
                      handleConnect(dev)
                    }
                  >

                    {connecting === dev?.id
                      ? 'Connecting...'
                      : 'Pair'}

                  </button>

                </div>

              ))}

            </div>

            <button
              className="btn-outline rescan-btn"
              onClick={startScan}
            >
              Rescan
            </button>

          </div>
        )}

        {/* CONNECTED */}
        {view === 'connected' &&
          connectedDevice && (

          <div className="connected-view">

            <div className="device-card card">

              <div className="device-card-header">

                <div className="device-icon large">
                  ⌚
                </div>

                <div>

                  <p className="dc-name">
                    {connectedDevice.name}
                  </p>

                  <p className="dc-mac">
                    {connectedDevice.id}
                  </p>

                </div>

                <div className="battery-chip">
                  ⚡ {battery}%
                </div>

              </div>

              <div className="quick-stats">

                {[
                  {
                    label: 'Heart Rate',
                    val: `${heartRate} bpm`,
                    icon: '❤️'
                  },
                  {
                    label: 'Steps',
                    val: steps,
                    icon: '👟'
                  },
                  {
                    label: 'Calories',
                    val: calories,
                    icon: '🔥'
                  },
                  {
                    label: 'Distance',
                    val: `${distance} km`,
                    icon: '📏'
                  },
                ].map(s => (

                  <div
                    key={s.label}
                    className="qstat"
                  >

                    <span className="qstat-icon">
                      {s.icon}
                    </span>

                    <span className="qstat-val">
                      {s.val}
                    </span>

                    <span className="qstat-label">
                      {s.label}
                    </span>

                  </div>

                ))}

              </div>

            </div>

            <button
              className="btn-primary"
              onClick={handleStartMonitoring}
            >
              Start Live Monitoring
            </button>

            <button
              className="btn-outline disconnect-btn"
              onClick={handleDisconnect}
            >
              Disconnect
            </button>

          </div>
        )}

        {/* LIVE */}
        {view === 'live' && (

          <div className="live-view">

            <div
              className="hr-card card"
              style={{
                borderColor: `${hrColor}44`
              }}
            >

              <div className="hr-zone-row">

                <span
                  className="hr-zone-label"
                  style={{
                    color: hrColor
                  }}
                >
                  {currentZone?.name}
                </span>

                <div
                  className="hr-live-dot"
                  style={{
                    background: hrColor
                  }}
                />

              </div>

              <div className="hr-display">

                <span
                  className="hr-number"
                  style={{
                    color: hrColor
                  }}
                >
                  {heartRate}
                </span>

                <span className="hr-unit">
                  BPM
                </span>

              </div>

              {/* GRAPH */}
              <svg
                className="hr-sparkline"
                viewBox={`0 0 ${hrHistory.length * 16} 40`}
              >

                <polyline
                  points={hrHistory.map(
                    (v, i) =>
                      `${i * 16 + 8},${
                        40 -
                        ((v - minHr) / hrRange) * 36
                      }`
                  ).join(' ')}

                  fill="none"

                  stroke={hrColor}

                  strokeWidth="2"
                />

              </svg>

              {/* ZONES */}
              <div className="zone-bar">

                {HR_ZONES.map(z => (

                  <div
                    key={z.name}
                    className="zone-seg"
                    style={{
                      background: z.color,
                      opacity:
                        currentZone?.name === z.name
                          ? 1
                          : 0.25
                    }}
                  />

                ))}

              </div>

            </div>

            {/* LIVE STATS */}
            <div className="live-stats-grid">

              {[
                {
                  label: 'Steps',
                  val: steps,
                  icon: '👟'
                },
                {
                  label: 'Calories',
                  val: calories,
                  icon: '🔥'
                },
                {
                  label: 'Distance',
                  val: `${distance} km`,
                  icon: '📏'
                },
                {
                  label: 'Battery',
                  val: `${battery}%`,
                  icon: '⚡'
                },
              ].map(s => (

                <div
                  key={s.label}
                  className="live-stat-card card"
                >

                  <span className="ls-icon">
                    {s.icon}
                  </span>

                  <span className="ls-val">
                    {s.val}
                  </span>

                  <span className="ls-label">
                    {s.label}
                  </span>

                </div>

              ))}

            </div>

            <button
              className="btn-outline stop-btn"
              onClick={() => {

                setMonitoring(false);

                setView('connected');
              }}
            >
              Stop Monitoring
            </button>

          </div>
        )}

        <div style={{ height: 20 }} />

      </div>

      <BottomNav
        activePage="band"
        onNavigate={onNavigate}
      />

    </div>
  );
}
