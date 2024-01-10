'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player';
import * as musicMetadata from 'music-metadata-browser';

import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import Image from 'next/image';
import { FastForward, Pause, Play, Rewind, Volume1, Volume2 } from 'lucide-react';
// import { getMetadata } from '@/app/_lib/metadata';
type Props = {
  bucket?: string;
  fileName: string;
  imageUrl?: string;
  productName: string;
  productOwner: string;
  handleNext: (id: number) => void;
  handlePrev: (id: number) => void;
  fileId: number;
  // seconds?: number;
  onStart?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
};

// export type TAudioMetaData = {
//   title: string;
//   album?: string | null;
//   artist?: string | null;
//   track?: number | null;
//   picture?: musicMetadata.IPicture[] | null;
//   genre?: string[] | null;
// };

const Player = ({
  bucket,
  fileName,
  handleNext,
  handlePrev,
  fileId,
  imageUrl,
  productName,
  productOwner,
  onPlay,
  onPause,
  onStart,
}: Props) => {
  /**
   * [] メタデータ(アーティスト情報・アルバム名・画像)を表示
   * [] 名前をクリックすると再生
   */
  const theme = useTheme();
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
    <div className="w-full overflow-hidden">
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
        />
      </div>
      <div className="relative z-[1] m-auto w-[343px] max-w-full rounded-2xl bg-white/40 p-4 backdrop-blur-[40]">
        <div className="flex items-center">
          {imageUrl ? (
            <div className="h-[100px] w-[100px] shrink-0 overflow-hidden rounded-lg bg-black/[0.08] object-cover '& > img': {@apply w-full}">
              <Image width={100} height={100} alt={fileName} src={imageUrl} />
            </div>
          ) : null}
          <div className="ml-1.5 min-w-0">
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {productOwner}
            </Typography>
            <Typography noWrap>
              <b>{fileName?.split('.').slice(0, -1).join('.')}</b>
            </Typography>
            <Typography noWrap letterSpacing={-0.25}>
              {productName}
            </Typography>
          </div>
        </div>
        <Slider
          // onChangeCommitted={playerRef?.current?.seekTo(position)}
          aria-label="time-indicator"
          size="small"
          value={position}
          min={0}
          step={1}
          max={duration}
          onChange={(_, value) => handlePositionSlider(value as number)}
          sx={{
            color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
            height: 4,
            '& .MuiSlider-thumb': {
              width: 8,
              height: 8,
              transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
              '&:before': {
                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
              },
              '&:hover, &.Mui-focusVisible': {
                boxShadow: `0px 0px 0px 8px ${
                  theme.palette.mode === 'dark' ? 'rgb(255 255 255 / 16%)' : 'rgb(0 0 0 / 16%)'
                }`,
              },
              '&.Mui-active': {
                width: 20,
                height: 20,
              },
            },
            '& .MuiSlider-rail': {
              opacity: 0.28,
            },
          }}
        />
        <div className="mt-[-8px] flex items-center justify-between">
          <p className="text-xs font-medium tracking-tighter opacity-[38]">
            {formatDuration(position)}
          </p>
          <p className="text-xs font-medium tracking-tighter opacity-[38]">
            -{formatDuration(duration - position)}
          </p>
        </div>
        <div className="mt-[-4px] flex items-center justify-center">
          <IconButton aria-label="previous song" onClick={() => handlePrev(fileId)}>
            <Rewind className="text-4xl" />
          </IconButton>
          <IconButton aria-label={paused ? 'play' : 'pause'} onClick={() => setPaused(!paused)}>
            {paused ? <Play className="text-5xl" /> : <Pause className="text-5xl" />}
          </IconButton>
          <IconButton aria-label="next song" onClick={() => handleNext(fileId)}>
            <FastForward className="text-4xl" />
          </IconButton>
        </div>
        <div className="mb-1 flex items-center justify-center space-x-2 px-1">
          <Volume1 />
          <Slider
            aria-label="Volume"
            defaultValue={30}
            value={volume}
            onChange={(_, value) => setVolume(value as number)}
            sx={{
              color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
              '& .MuiSlider-track': {
                border: 'none',
              },
              '& .MuiSlider-thumb': {
                width: 24,
                height: 24,
                backgroundColor: '#fff',
                '&:before': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                },
                '&:hover, &.Mui-focusVisible, &.Mui-active': {
                  boxShadow: 'none',
                },
              },
            }}
          />
          <Volume2 />
        </div>
      </div>
    </div>
  );
};

export default Player;
