import React from 'react'
import Animation from './Animation'
import generateFrameSequence from './generateFrameSequence'

const gapBetweenImages = 8
const rulerWidth = 8

export const App = () => {
  const filename = new URLSearchParams(location.search).get('file')
  const [meta, setMeta] = React.useState<AnimationMeta>()
  const [width, setWidth] = React.useState(0)
  const [scale, setScale] = React.useState(4)
  const [fallbackFrameCount, setFallbackFrameCount] = React.useState(0)
  const [error, setError] = React.useState<string>()
  const totalWidth = width * 2 * scale + gapBetweenImages + rulerWidth * 1.5

  React.useEffect(() => {
    if (filename) {
      fetch(`./workspace/${filename}.png.mcmeta`)
        .catch((e: Error) => setError('Request error: ' + e.message))
        .then((response) => {
          if (!response) {
            return
          }

          return response.text().then((text) => {
            try {
              return JSON.parse(text)
            } catch (e) {
              setError('Parse error: ' + e.message + '\nData:\n' + text)
            }
          })
        })
        .then(setMeta)
        .catch((e: Error) => setError(e.message))
    }
  }, [filename])

  if (error) {
    return <pre>Error: {error}</pre>
  }

  const animationUrl = `./workspace/${filename}.png`

  return !meta ? (
    <div>Loading...</div>
  ) : (
    <div
      style={{
        margin: 'auto',
        width: totalWidth,
        fontSize: 16,
        fontFamily: 'Fira Code,Courier New,Menlo,monospace',
      }}
    >
      <div style={{ position: 'absolute', bottom: '1rem', right: '1rem' }}>
        <div style={{ textAlign: 'right', padding: 4 }}>
          Scale:{' '}
          <input
            type="number"
            value={scale}
            onChange={(e) => setScale(e.target.valueAsNumber)}
            style={{ width: '2rem' }}
          />
        </div>
        <div style={{ textAlign: 'right', padding: 4 }}>
          Size:{' '}
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.valueAsNumber)}
            style={{ width: '2rem' }}
          />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '1rem',
        }}
      >
        {fallbackFrameCount && (
          <Animation
            image={animationUrl}
            width={scale * width}
            frameSequence={generateFrameSequence(
              meta.animation,
              fallbackFrameCount
            )}
            interpolate={meta.animation.interpolate || false}
          />
        )}
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
            src={animationUrl}
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
