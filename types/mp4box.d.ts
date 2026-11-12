declare module "mp4box" {
  export interface MP4ArrayBuffer extends ArrayBuffer {
    fileStart: number;
  }

  export interface MP4VideoTrack {
    id: number;
    codec: string;
    timescale: number;
    duration: number;
    nb_samples: number;
    video?: {
      width: number;
      height: number;
    };
  }

  export interface MP4Info {
    duration: number;
    timescale: number;
    videoTracks: MP4VideoTrack[];
  }

  export interface MP4Sample {
    track_id: number;
    cts: number;
    dts: number;
    duration: number;
    timescale: number;
    is_sync: boolean;
    data: Uint8Array;
  }

  export interface MP4StsdEntry {
    avcC?: { write: (stream: DataStream) => void };
    hvcC?: { write: (stream: DataStream) => void };
    vpcC?: { write: (stream: DataStream) => void };
    av1C?: { write: (stream: DataStream) => void };
  }

  export interface MP4TrakBox {
    mdia: {
      minf: {
        stbl: {
          stsd: {
            entries: MP4StsdEntry[];
          };
        };
      };
    };
  }

  export class DataStream {
    static BIG_ENDIAN: boolean;
    static LITTLE_ENDIAN: boolean;
    buffer: ArrayBuffer;
    position: number;
    constructor(
      buffer?: ArrayBuffer,
      byteOffset?: number,
      endianness?: boolean
    );
  }

  export interface ISOFile {
    onReady: ((info: MP4Info) => void) | null;
    onSamples:
      | ((trackId: number, user: unknown, samples: MP4Sample[]) => void)
      | null;
    onError: ((err: unknown) => void) | null;
    appendBuffer: (data: MP4ArrayBuffer) => number;
    flush: () => void;
    getTrackById: (id: number) => MP4TrakBox;
    setExtractionOptions: (
      trackId: number,
      user?: unknown,
      options?: { nbSamples?: number }
    ) => void;
    start: () => void;
    stop: () => void;
  }

  export function createFile(): ISOFile;
}
