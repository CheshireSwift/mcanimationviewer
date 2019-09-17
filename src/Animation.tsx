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
  const [applyAnimationClasses, setApplyAnimationClasses] = React.useState(
    false
  )
  const successorIndex = (n: number) => (n + 1) % frameSequence.length
  const timeoutIds = React.useRef<number[]>([])

  const advanceFrame = (current: number) => () => {
    const nextFrameIndex = successorIndex(current)
    const { time } = frameSequence[nextFrameIndex]

    setFrameIndex(nextFrameIndex)
    setApplyAnimationClasses(true)

    timeoutIds.current = [
      // Clear out the fade (ready to be reapplied) one tick before the current frame is done
      setTimeout(() => {
        setApplyAnimationClasses(false)
      }, (time - 1) * 50),

      setTimeout(advanceFrame(nextFrameIndex), time * 50),
    ]
  }

  const clearTimeouts = () => {
    timeoutIds.current.forEach(clearTimeout)
  }

  React.useEffect(() => {
    advanceFrame(-1)()
    return clearTimeouts
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
    <div style={{ position: 'relative', minWidth: '8rem' }}>
      <div
        style={{
          ...divStyling,
          backgroundPositionY: backgroundYForIndex(frameIndex),
        }}
      />
      {interpolate && (
        <>
          <div
            style={{
              ...divStyling,
              backgroundPositionY: backgroundYForIndex(
                successorIndex(frameIndex)
              ),
              animationName: applyAnimationClasses && 'fadein',
              opacity: applyAnimationClasses ? 0 : 1,
              animationDuration: frameSequence[frameIndex].time * 50 + 'ms',
            }}
          />
          <div
            style={{
              ...divStyling,
              backgroundPositionY: backgroundYForIndex(
                successorIndex(frameIndex)
              ),
              animationName: applyAnimationClasses && 'fadein',
              animationTimingFunction: 'linear',
              opacity: applyAnimationClasses ? 0 : 1,
              animationDuration: frameSequence[frameIndex].time * 50 + 'ms',
            }}
          />
        </>
      )}
      <div style={{ position: 'absolute', top: width, left: 0 }}>
        <div style={{ paddingTop: '0.5rem' }}>
          {frameIndex}: {frameSequence[frameIndex].index},
          {frameSequence[frameIndex].time}t
          <ProgressBar
            active={applyAnimationClasses}
            duration={frameSequence[frameIndex].time}
          />
        </div>
        <div style={{ paddingTop: '0.5rem' }}>
          (Next {frameSequence[successorIndex(frameIndex)].index})
        </div>
        <table>
          <tbody>
            {frameSequence.map((frame, index) => (
              <AnimationTableRow
                key={index}
                frame={frame}
                index={index}
                isCurrentFrame={index === frameIndex}
                isNextFrame={
                  interpolate && index === successorIndex(frameIndex)
                }
                onClick={() => {
                  clearTimeouts()
                  advanceFrame(index - 1)()
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const AnimationTableRow = ({
  frame,
  index,
  isCurrentFrame,
  isNextFrame,
  onClick,
}: {
  frame: Frame
  index: number
  isCurrentFrame: boolean
  isNextFrame: boolean
  onClick?: () => void
}) => {
  const color = isCurrentFrame ? 'black' : isNextFrame ? 'gray' : 'lightgray'
  return (
    <tr
      style={{
        padding: '0.5rem',
        color,
      }}
      onClick={onClick}
    >
      <td>{index}:</td>
      <td>
        {frame.index},{frame.time}t
        <ProgressBar
          active={isCurrentFrame}
          duration={frame.time}
          color={color}
        />
      </td>
    </tr>
  )
}

const height = '0.25rem'
const ProgressBar = ({
  active = true,
  duration,
  color = 'black',
}: {
  active?: boolean
  duration: number
  color?: string
}) => (
  <div style={{ position: 'relative', height }}>
    <div
      style={{
        position: 'absolute',
        height,
        width: '100%',
        border: '1px solid ' + color,
        boxSizing: 'border-box',
      }}
    />
    {active && (
      <div
        style={{
          position: 'absolute',
          height,
          width: 0,
          animationName: active && 'grow',
          animationDuration: duration * 50 + 'ms',
          animationTimingFunction: 'linear',
          backgroundColor: color,
        }}
      />
    )}
  </div>
)

export default Animation
