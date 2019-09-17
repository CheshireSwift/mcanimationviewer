import React from 'react'
import ProgressBar from './ProgressBar'
import FrameSequenceTable from './FrameSequenceTable'

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
        <FrameInfo
          index={frameIndex}
          frame={frameSequence[frameIndex]}
          nextFrame={frameSequence[successorIndex(frameIndex)]}
          active={applyAnimationClasses}
        />
        <FrameSequenceTable
          frameSequence={frameSequence}
          currentIndex={frameIndex}
          nextIndex={interpolate && successorIndex(frameIndex)}
          onClickRow={(index) => {
            clearTimeouts()
            advanceFrame(index - 1)()
          }}
        />
      </div>
    </div>
  )
}

const FrameInfo = ({
  index,
  frame,
  nextFrame,
  active,
}: {
  index: number
  frame: Frame
  nextFrame: Frame
  active: boolean
}) => (
  <>
    <div style={{ paddingTop: '0.5rem', position: 'relative' }}>
      [{index}]: {frame.index},{frame.time}t
      <ProgressBar
        style={{ position: 'relative', width: '100%' }}
        active={active}
        duration={frame.time}
      />
    </div>
    <div style={{ paddingTop: '0.5rem' }}>(Next {nextFrame.index})</div>
  </>
)

export default Animation
