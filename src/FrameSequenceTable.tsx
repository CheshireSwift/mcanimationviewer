import React from 'react'
import ProgressBar from './ProgressBar'

export const FrameSequenceTable = ({
  frameSequence,
  currentIndex,
  nextIndex,
  onClickRow,
}: {
  frameSequence: FrameSequence
  currentIndex: number
  nextIndex: number | false
  onClickRow: (index: number) => void
}) => {
  const [expanded, setExpanded] = React.useState(false)
  const totalFrames = frameSequence.reduce(
    (total, frame) => total + frame.time,
    0
  )

  return (
    <div style={{ position: 'relative' }}>
      <span
        style={{
          position: 'absolute',
          right: '100%',
          border: '1px solid black',
          width: '1rem',
          textAlign: 'center',
          margin: '0.25rem',
          cursor: 'pointer',
        }}
        onClick={() => {
          setExpanded(!expanded)
        }}
      >
        {expanded ? '-' : '+'}
      </span>
      <table
        style={{
          width: '100%',
          height: expanded && '40rem',
          borderLeft: '1px solid black',
        }}
      >
        <tbody>
          {frameSequence.map((frame, index) => (
            <FrameSequenceRow
              key={index}
              frame={frame}
              index={index}
              isCurrentFrame={index === currentIndex}
              isNextFrame={index === nextIndex}
              percentage={expanded && (100 * frame.time) / totalFrames}
              onClick={() => onClickRow(index)}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

const FrameSequenceRow = ({
  frame,
  index,
  isCurrentFrame,
  isNextFrame,
  percentage,
  onClick,
}: {
  frame: Frame
  index: number
  isCurrentFrame: boolean
  isNextFrame: boolean
  percentage: number | false
  onClick?: () => void
}) => {
  const color = isCurrentFrame ? 'black' : isNextFrame ? 'gray' : 'lightgray'
  const fontSize = percentage && Math.min(16, percentage * 16 * 40 * 0.01 * 0.5)

  return (
    <tr
      style={{
        padding: '0.5rem',
        color,
        height: percentage && `${percentage}%`,
        overflow: 'none',
        fontSize,
      }}
      onClick={onClick}
    >
      <td>[{index}]:</td>
      <td style={{ position: 'relative', paddingRight: '0.5rem' }}>
        {frame.index},{frame.time}t
        <ProgressBar
          active={isCurrentFrame}
          duration={frame.time}
          color={color}
          vertical
          style={{ position: 'absolute', right: 0, top: 0, bottom: 0 }}
        />
      </td>
    </tr>
  )
}

export default FrameSequenceTable
