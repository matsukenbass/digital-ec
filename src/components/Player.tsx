'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player';

import * as React from 'react';
import { Slider } from './ui/slider';
import Image from 'next/image';
import { FastForward, Pause, Play, Rewind, Volume1, Volume2 } from 'lucide-react';
type Props = {
  bucket?: string;
  fileName: string;
  imageUrl?: string;
  productName: string;
  productOwner: string;
  handleNext: (id: number) => void;
  handlePrev: (id: number) => void;
  fileId: number;
  metadata: { [k: string]: string };
  // seconds?: number;
  onStart?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
};

const Player = ({
  bucket,
  fileName,
  handleNext,
  handlePrev,
  fileId,
  imageUrl,
  productName,
  productOwner,
  metadata,
  onPlay,
  onPause,
  onStart,
}: Props) => {
  /**
   * [] メタデータ(アーティスト情報・アルバム名・画像)を表示
   * [] 名前をクリックすると再生
   */
  const [position, setPosition] = useState(0);
  const [paused, setPaused] = useState(true);
  const [volume, setVolume] = useState<number>(30);
  const [duration, setDuration] = useState(0); // FIXME:ファイルの再生時間を取得して格納する
  const [url, setUrl] = useState(`${process.env.NEXT_PUBLIC_SERVER_URL}/audio/${fileName}`);

  const handleFileChange = useCallback(() => {
    if (url !== `${process.env.NEXT_PUBLIC_SERVER_URL}/audio/${fileName}`) {
      setUrl(`${process.env.NEXT_PUBLIC_SERVER_URL}/audio/${fileName}`);
      setPaused(false);
      setPosition(0);
    }
  }, [fileName, url]);

  useEffect(() => {
    if (position === duration && position !== 0) {
      setPosition(0);
      handleNext(fileId);
    }
  }, [duration, fileId, position, handleNext]);

  useEffect(() => {
    handleFileChange();
  }, [bucket, fileName, handleFileChange]);

  const playerRef = useRef<ReactPlayer>(null);

  const handlePositionSlider = (value: number) => {
    setPosition(value);
    playerRef?.current?.seekTo(value);
  };

  const handleDuration = (value: number) => {
    setDuration(value);
  };

  function formatDuration(value: number) {
    const minute = Math.floor(value / 60);
    const secondLeft = Math.floor(value - minute * 60);
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  }

  return (
    <div className="mt-8 w-full overflow-hidden">
      <div className="hidden">
        <ReactPlayer
          url={url} //MEMO:GoogleDriveから取ってくるときは'https://drive.google.com/uc?id=1sDzBtne8T4HwGK2HCcelQQ4Zb3DnUfDV'みたいな感じ
          playing={!paused}
          volume={volume / 100}
          controls
          width="100%"
          height="100%"
          ref={playerRef}
          // onSeek={(state) => setPosition(state)}
          onProgress={(state) => setPosition(state.playedSeconds)}
          onDuration={(d) => handleDuration(d)}
          lazy
          preload="auto"
        />
      </div>
      <div className="relative z-[1] m-auto w-[343px] max-w-full rounded-2xl bg-white/40 p-4 backdrop-blur-[40]">
        <div className="flex items-center">
          {imageUrl ? (
            <div className="h-[100px] w-[100px] shrink-0 overflow-hidden rounded-lg bg-black/[0.08] object-cover '& > img': {@apply w-full}">
              <Image width={100} height={100} alt={fileName} src={imageUrl} priority={true} />
            </div>
          ) : null}
          <div className="ml-1.5 min-w-0">
            <p className="text-ellipsis text-nowrap text-sm font-medium text-black">
              {metadata.artist}
            </p>
            <p className="whitespace-nowrap text-lg">
              <b>{fileName?.split('.').slice(0, -1).join('.')}</b>
            </p>
            <p className="whitespace-nowrap tracking-tight text-slate-600">{metadata.album}</p>
          </div>
        </div>
        <div className="mb-4 mt-8">
          <Slider
            // onChangeCommitted={playerRef?.current?.seekTo(position)}
            aria-label="time-indicator"
            value={[position]}
            min={0}
            step={1}
            max={duration}
            onValueChange={(value: number[]) => handlePositionSlider(value[0])}
          />
        </div>
        <div className="mt-[-8px] flex items-center justify-between">
          <p className="text-xs font-medium tracking-tighter opacity-[38]">
            {formatDuration(position)}
          </p>
          <p className="text-xs font-medium tracking-tighter opacity-[38]">
            -{formatDuration(duration - position)}
          </p>
        </div>
        <div className="mt-[-4px] flex items-center justify-center">
          <div aria-label="previous song" onClick={() => handlePrev(fileId)} className="m-2">
            <Rewind className="text-4xl" onClick={() => handlePrev(fileId)} />
          </div>
          <div
            aria-label={paused ? 'play' : 'pause'}
            onClick={() => setPaused(!paused)}
            className="m-2"
          >
            {paused ? <Play className="text-5xl" /> : <Pause className="text-5xl" />}
          </div>
          <div aria-label="next song" onClick={() => handleNext(fileId)} className="m-2">
            <FastForward className="text-4xl" />
          </div>
        </div>
        <div className="my-1 flex items-center justify-center space-x-2 px-1">
          <Volume1 />
          <Slider
            aria-label="Volume"
            defaultValue={[30]}
            value={[volume]}
            onValueChange={(value: number[]) => setVolume(value[0])}
          />
          <Volume2 />
        </div>
      </div>
    </div>
  );
};

export default Player;
