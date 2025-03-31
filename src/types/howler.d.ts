// src/types/howler.d.ts
declare module 'howler' {
  export interface HowlOptions {
    src: string | string[];
    volume?: number;
    html5?: boolean;
    loop?: boolean;
    preload?: boolean;
    autoplay?: boolean;
    mute?: boolean;
    sprite?: { [name: string]: [number, number] };
    rate?: number;
    onload?: () => void;
    onloaderror?: (id: number, error: any) => void;
    onplay?: (id: number) => void;
    onend?: (id: number) => void;
    onpause?: (id: number) => void;
    onstop?: (id: number) => void;
    onmute?: (id: number) => void;
    onvolume?: (id: number) => void;
    onrate?: (id: number) => void;
    onseek?: (id: number) => void;
    onfade?: (id: number) => void;
  }

  export class Howl {
    constructor(options: HowlOptions);
    play(sprite?: string | number): number;
    pause(id?: number): this;
    stop(id?: number): this;
    volume(volume?: number, id?: number): this | number;
    fade(from: number, to: number, duration: number, id?: number): this;
    mute(muted?: boolean, id?: number): this | boolean;
    loop(loop?: boolean, id?: number): this | boolean;
    state(): 'unloaded' | 'loading' | 'loaded';
    playing(id?: number): boolean;
    duration(id?: number): number;
    seek(seek?: number, id?: number): this | number;
    on(event: string, fn: Function, id?: number): this;
    once(event: string, fn: Function, id?: number): this;
    off(event: string, fn?: Function, id?: number): this;
    load(): this;
    unload(): void;
  }

  export class Howler {
    static volume(volume?: number): number | Howler;
    static mute(muted?: boolean): boolean | Howler;
    static stop(): void;
    static codecs(extension: string): boolean;
  }
}
