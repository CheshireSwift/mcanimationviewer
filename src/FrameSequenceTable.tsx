import React from 'react'
import ProgressBar from './ProgressBar'

const tableRems = 40

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
        title={
          expanded ? 'Collapse to even rows' : 'Expand to proportional rows'
        }
        onClick={() => {
          setExpanded(!expanded)
        }}
      >
        {expanded ? '-' : '+'}
      </span>
      <table
        style={{
          width: '100%',
          height: expanded && tableRems + 'rem',
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

const fontSizeForPercentage = (percentage: number) =>
  Math.min(
    percentage *
    0.01 * // percentage to proportion 0..1
    tableRems *
    16 * // pixels per rem
      0.5, // halving the total number of pixels available gets a reasonable font size

    16 // capped at 16
  )

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

  return (
    <tr
      style={{
        padding: '0.5rem',
        color,
        height: percentage && `${percentage}%`,
        overflow: 'none',
        fontSize: percentage && fontSizeForPercentage(percentage),
      }}
      onClick={onClick}
      title={
        (percentage ? `[${index}]:${frame.index},${frame.time}t; ` : '') +
        `Frameset entry [${index}] uses animation frame ${frame.index}, displaying it for ${frame.time} ticks`
      }
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
