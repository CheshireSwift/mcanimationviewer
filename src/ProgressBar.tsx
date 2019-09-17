import React from 'react'

const fixedSize = '0.25rem'

const variableAxis = (vertical: boolean) => (vertical ? 'height' : 'width')
const fixedAxis = (vertical: boolean) => variableAxis(!vertical)

export const ProgressBar = ({
  active = true,
  duration,
  color = 'black',
  vertical = false,
  style = {},
}: {
  active?: boolean
  duration: number
  color?: string
  vertical?: boolean
  style?: React.CSSProperties
}) => (
  <div style={style}>
    <div
      style={{
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        position: 'absolute',
        [fixedAxis(vertical)]: fixedSize,
        border: '1px solid gray',
        boxSizing: 'border-box',
      }}
    />
    {active && (
      <div
        style={{
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          position: 'absolute',
          [fixedAxis(vertical)]: fixedSize,
          transformOrigin: 'top',
          animationName: active && (vertical ? 'heighten' : 'widen'),
          animationDuration: duration * 50 + 'ms',
          animationTimingFunction: 'linear',
          backgroundColor: color,
        }}
      />
    )}
  </div>
)

export default ProgressBar
