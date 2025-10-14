declare module "lenis" {
  interface LenisOptions {
    lerp?: number;
    wheelMultiplier?: number;
    syncTouch?: boolean;
    smoothWheel?: boolean;
    [key: string]: unknown; // allow vendor extensions without using any
  }
  type LenisScrollTarget = number | string | HTMLElement;
  type LenisEventCallback = (instance: LenisInstance) => void;

  interface LenisInstance {
    raf: (time?: number) => void;
    on: (event: "scroll", cb: LenisEventCallback) => void;
    scrollTo: (target: LenisScrollTarget, opts?: { immediate?: boolean }) => void;
    destroy: () => void;
    resize: () => void;
  }

  class Lenis implements LenisInstance {
    constructor(opts?: LenisOptions);
    raf(time?: number): void;
    on(event: "scroll", cb: LenisEventCallback): void;
    scrollTo(target: LenisScrollTarget, opts?: { immediate?: boolean }): void;
    destroy(): void;
    resize(): void;
  }
  export default Lenis;
}
