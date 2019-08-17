import React from 'react'
import animation from '../animation/animation.png'
import meta from '../animation/animation.png.mcmeta.json'
import Animation from './Animation'
import generateFrameSequence from './generateFrameSequence'

const gapBetweenImages = 8
const rulerWidth = 8

export const App = () => {
  const [width, setWidth] = React.useState(0)
  const [scale, setScale] = React.useState(4)
  const [fallbackFrameCount, setFallbackFrameCount] = React.useState(0)
  const totalWidth = width * 2 * scale + gapBetweenImages + rulerWidth * 1.5

  return (
    <div style={{ margin: 'auto', width: totalWidth }}>
      <div style={{ textAlign: 'right', padding: 4 }}>
        Scale:{' '}
        <input
          type="number"
          value={scale}
          onChange={(e) => setScale(e.target.valueAsNumber)}
          style={{ width: '2rem' }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Animation
          image={animation}
          width={scale * width}
          frameSequence={generateFrameSequence(
            meta.animation,
            fallbackFrameCount
          )}
          interpolate={meta.animation.interpolate || false}
        />
        <div style={{ display: 'flex', width: scale * width + rulerWidth }}>
          <div>
            {Array.from({ length: fallbackFrameCount }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: width * scale,
                  width: rulerWidth / 2,
                  borderTop: '0.5px solid gray',
                }}
              />
            ))}
          </div>
          <img
            src={animation}
            alt="Raw image"
            style={{
              width: scale * width,
              imageRendering: 'crisp-edges',
            }}
            onLoad={(e) => {
              setWidth(e.currentTarget.naturalWidth)
              setFallbackFrameCount(
                e.currentTarget.naturalHeight / e.currentTarget.naturalWidth
              )
            }}
          />
          <div>
            {Array.from({ length: fallbackFrameCount }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: width * scale,
                  width: rulerWidth,
                  borderTop: '0.5px solid gray',
                }}
              >
                {i}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
