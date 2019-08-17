const attachMissingTime = (frametime: number) => (
  frame: Frame | number
): Frame =>
  typeof frame === 'number' ? { index: frame, time: frametime } : frame

export const generateFrameSequence = (
  { frames, frametime = 1 }: AnimationMeta['animation'],
  fallbackFrameCount: number
): FrameSequence => {
  const framesToUse =
    frames ||
    Array.from({ length: fallbackFrameCount }).map((_, i) => ({
      index: i,
      time: frametime,
    }))

  return framesToUse.map(attachMissingTime(frametime))
}

export default generateFrameSequence
