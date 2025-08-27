import React, { useRef, useMemo } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 3D Bar Chart Component using Three.js
 * Renders true 3D bars with interactive controls
 */
const ThreeDBarChart = ({ data, chartType = 'bar' }) => {
  const groupRef = useRef();
  const barsRef = useRef([]);

  // Generate 3D bars from data
  const bars = useMemo(() => {
    if (!data || !data.labels || !data.datasets) return [];
    
    const labels = data.labels;
    const values = data.datasets[0].data;
    const maxValue = Math.max(...values);
    
    return labels.map((label, index) => {
      const value = values[index];
      const height = (value / maxValue) * 5; // Scale height
      const x = (index - labels.length / 2) * 2; // Spread bars
      const y = height / 2; // Center vertically
      
      return {
        position: [x, y, 0],
        height,
        value,
        label,
        color: new THREE.Color().setHSL(index / labels.length, 0.7, 0.5)
      };
    });
  }, [data]);

  // Animate bars
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    
    barsRef.current.forEach((barRef, index) => {
      if (barRef) {
        barRef.scale.y = THREE.MathUtils.lerp(barRef.scale.y, 1, 0.1);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {bars.map((bar, index) => (
        <group key={index} position={bar.position}>
          {/* 3D Bar */}
          <mesh
            ref={(el) => (barsRef.current[index] = el)}
            scale={[0.8, 0, 0.8]}
          >
            <boxGeometry args={[1, bar.height, 1]} />
            <meshStandardMaterial 
              color={bar.color} 
              metalness={0.3}
              roughness={0.4}
            />
          </mesh>
          
          {/* Bar Label */}
          <mesh position={[0, -bar.height / 2 - 0.5, 0]}>
            <planeGeometry args={[2, 0.5]} />
            <meshBasicMaterial color="white" transparent opacity={0.8} />
          </mesh>
        </group>
      ))}
      
      {/* Grid */}
      <gridHelper args={[20, 20, 0x444444, 0x222222]} />
      
      {/* Axes */}
      <axesHelper args={[10]} />
    </group>
  );
};

/**
 * 3D Pie Chart Component using Three.js
 * Renders 3D pie chart using stacked cylinders
 */
const ThreeDPieChart = ({ data }) => {
  const groupRef = useRef();

  // Generate 3D pie data
  const pieData = useMemo(() => {
    if (!data || !data.labels || !data.datasets) return [];
    
    const labels = data.labels;
    const values = data.datasets[0].data;
    const total = values.reduce((sum, val) => sum + val, 0);
    
    return labels.map((label, index) => {
      const value = values[index];
      const percentage = (value / total) * 100;
      
      return {
        label,
        value,
        percentage,
        color: new THREE.Color().setHSL(index / labels.length, 0.7, 0.5)
      };
    });
  }, [data]);

  // Animate rotation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Create 3D pie using stacked cylinders */}
      {pieData.map((item, index) => {
        const radius = 3 - (index * 0.3); // Each slice gets smaller
        const height = (item.percentage / 100) * 2; // Height based on percentage
        
        return (
          <group key={index} position={[0, index * 0.2, 0]}>
            <mesh>
              <cylinderGeometry args={[radius, radius, height, 32]} />
              <meshStandardMaterial 
                color={item.color} 
                metalness={0.3}
                roughness={0.4}
                transparent
                opacity={0.8}
              />
            </mesh>
            
            {/* Add label */}
            <mesh position={[radius + 1, 0, 0]}>
              <planeGeometry args={[2, 0.5]} />
              <meshBasicMaterial color="white" transparent opacity={0.9} />
            </mesh>
          </group>
        );
      })}
      
      {/* Center sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

/**
 * 3D Line Chart Component using Three.js
 * Renders true 3D line with points
 */
const ThreeDLineChart = ({ data }) => {
  const groupRef = useRef();
  const lineRef = useRef();

  // Generate 3D line points
  const points = useMemo(() => {
    if (!data || !data.labels || !data.datasets) return [];
    
    const labels = data.labels;
    const values = data.datasets[0].data;
    const maxValue = Math.max(...values);
    
    return labels.map((label, index) => {
      const value = values[index];
      const y = (value / maxValue) * 5;
      const x = (index - labels.length / 2) * 2;
      
      return new THREE.Vector3(x, y, 0);
    });
  }, [data]);

  // Create line geometry
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [points]);

  // Animate line
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 3D Line */}
      <line ref={lineRef}>
        <bufferGeometry {...lineGeometry} />
        <lineBasicMaterial color="#00ff00" linewidth={3} />
      </line>
      
      {/* Points */}
      {points.map((point, index) => (
        <mesh key={index} position={point}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#ff0000" />
        </mesh>
      ))}
      
      {/* Grid */}
      <gridHelper args={[20, 20, 0x444444, 0x222222]} />
      <axesHelper args={[10]} />
    </group>
  );
};

/**
 * Main 3D Chart Component
 * Renders different 3D chart types based on props
 */
const ThreeDChart = ({ data, chartType = 'bar', width = 600, height = 400, onCanvasReady }) => {
  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <ThreeDBarChart data={data} />;
      case 'pie':
        return <ThreeDPieChart data={data} />;
      case 'line':
        return <ThreeDLineChart data={data} />;
      default:
        return <ThreeDBarChart data={data} />;
    }
  };

  return (
    <div style={{ width, height, border: '1px solid #333' }}>
      <Canvas
        camera={{ position: [10, 10, 10], fov: 50 }}
        style={{ background: 'linear-gradient(to bottom, #1a1a2e, #16213e)' }}
        onCreated={({ gl, scene, camera }) => {
          // Store the renderer for download purposes
          if (onCanvasReady) {
            onCanvasReady(gl, scene, camera);
          }
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Chart */}
        {renderChart()}
        
        {/* Controls */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
};

export default ThreeDChart;
