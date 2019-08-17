declare module '*.png' {
  const url: string
  export = url
}

declare type Frame = { index: number; time: number }
declare type FrameSequence = Frame[]

declare type AnimationMeta = {
  animation: {
    interpolate?: boolean
    frametime?: number
    frames?: Array<number | Frame>
  }
}

declare module '*.mcmeta.json' {
  const meta: AnimationMeta
  export = meta
}
