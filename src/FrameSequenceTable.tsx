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
}) => (
  <table>
    <tbody>
      {frameSequence.map((frame, index) => (
        <FrameSequenceRow
          key={index}
          frame={frame}
          index={index}
          isCurrentFrame={index === currentIndex}
          isNextFrame={index === nextIndex}
          onClick={() => onClickRow(index)}
        />
      ))}
    </tbody>
  </table>
)

const FrameSequenceRow = ({
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
