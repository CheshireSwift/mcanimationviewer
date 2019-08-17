import generateFrameSequence from './generateFrameSequence'

describe('processing the metadata into a framesequence', () => {
  it('results in the input frames when they are fully specified', () => {
    const animation = {
      frames: [
        { index: 0, time: 2 },
        { index: 1, time: 4 },
        { index: 17, time: 1 },
      ],
      frametime: 1,
    }

    expect(generateFrameSequence(animation, 3)).toEqual(animation.frames)
  })

  it('fills in missing times with the shared frametime', () => {
    const fullFrame = { index: 0, time: 2 }
    const animation = {
      frames: [fullFrame, 1, 2],
      frametime: 7,
    }

    expect(generateFrameSequence(animation, 3)).toEqual([
      fullFrame,
      { index: 1, time: 7 },
      { index: 2, time: 7 },
    ])
  })

  it('generates the fallback number of frames when none are provided', () => {
    expect(generateFrameSequence({ frametime: 3 }, 2)).toEqual([
      { index: 0, time: 3 },
      { index: 1, time: 3 },
    ])
  })

  it('generates fully from a minimal specification', () => {
    expect(generateFrameSequence({}, 4)).toEqual([
      { index: 0, time: 1 },
      { index: 1, time: 1 },
      { index: 2, time: 1 },
      { index: 3, time: 1 },
    ])
  })
})
