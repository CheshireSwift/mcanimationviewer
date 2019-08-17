import React from 'react'

export const Animation = ({
  image,
  width,
  frameSequence,
  interpolate,
}: {
  image: string
  width: number
  frameSequence: FrameSequence
  interpolate: boolean
}) => {
  const [frameIndex, setFrameIndex] = React.useState(0)
  const [includeFade, setIncludeFade] = React.useState(false)
  const successorIndex = (n: number) => (n + 1) % frameSequence.length
  const timeoutIds = React.useRef<number[]>([])

  const advanceFrame = (current: number) => () => {
    const nextFrameIndex = successorIndex(current)
    const { time } = frameSequence[nextFrameIndex]

    setFrameIndex(nextFrameIndex)
    setIncludeFade(interpolate)

    timeoutIds.current = [
      // Clear out the fade (ready to be reapplied) one tick before the current frame is done
      setTimeout(() => {
        setIncludeFade(false)
      }, (time - 1) * 50),

      setTimeout(advanceFrame(nextFrameIndex), time * 50),
    ]
  }

  React.useEffect(() => {
    advanceFrame(-1)()
    return () => {
      timeoutIds.current.forEach(clearTimeout)
    }
  }, [image, width, frameSequence])

  const divStyling = {
    position: 'absolute',
    top: 0,
    left: 0,
    height: width,
    width: width,
    backgroundImage: `url(${image})`,
    backgroundSize: width,
    imageRendering: 'crisp-edges',
  }

  const backgroundYForIndex = (index: number) =>
    -frameSequence[index].index * width

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          ...divStyling,
          backgroundPositionY: backgroundYForIndex(frameIndex),
        }}
      />
      <div
        style={{
          ...divStyling,
          backgroundPositionY: backgroundYForIndex(successorIndex(frameIndex)),
          animationName: includeFade && 'fadein',
          opacity: includeFade ? 0 : 1,
          animationDuration: frameSequence[frameIndex].time * 50 + 'ms',
        }}
      />
      <div style={{ position: 'absolute', top: width, left: 0, width }}>
        <p>
          {frameIndex} for {frameSequence[frameIndex].time}t
        </p>
        <p>(Next {successorIndex(frameIndex)})</p>
      </div>
    </div>
  )
}

export default Animation
