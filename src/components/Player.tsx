import { useRef, useState, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player';
import * as musicMetadata from 'music-metadata-browser';

import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import FastForwardRounded from '@mui/icons-material/FastForwardRounded';
import FastRewindRounded from '@mui/icons-material/FastRewindRounded';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import VolumeDownRounded from '@mui/icons-material/VolumeDownRounded';
import Image from 'next/image';
// import { getMetadata } from '@/app/_lib/metadata';
type Props = {
  bucket?: string;
  fileName: string;
  imageUrl?: string;
  handleNext: (id: number) => void;
  handlePrev: (id: number) => void;
  fileId: number;
  // seconds?: number;
  onStart?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
};

export type TAudioMetaData = {
  title: string;
  album?: string | null;
  artist?: string | null;
  track?: number | null;
  picture?: musicMetadata.IPicture[] | null;
  genre?: string[] | null;
};

const Widget = styled('div')(({ theme }) => ({
  padding: 16,
  borderRadius: 16,
  width: 343,
  maxWidth: '100%',
  margin: 'auto',
  position: 'relative',
  zIndex: 1,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.4)',
  backdropFilter: 'blur(40px)',
}));

const CoverImage = styled('div')({
  width: 100,
  height: 100,
  objectFit: 'cover',
  overflow: 'hidden',
  flexShrink: 0,
  borderRadius: 8,
  backgroundColor: 'rgba(0,0,0,0.08)',
  '& > img': {
    width: '100%',
  },
});

const TinyText = styled(Typography)({
  fontSize: '0.75rem',
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});

export default function Player({
  bucket,
  fileName,
  handleNext,
  handlePrev,
  fileId,
  imageUrl,
  onPlay,
  onPause,
  onStart,
}: Props) {
  /**
   * [] メタデータ(アーティスト情報・アルバム名・画像)を表示
   * [] 名前をクリックすると再生
   */
  const theme = useTheme();
  const [position, setPosition] = useState(0);
  const [paused, setPaused] = useState(false);
  const [volume, setVolume] = useState<number>(30);
  const [duration, setDuration] = useState(-1); // FIXME:ファイルの再生時間を取得して格納する
  const [url, setUrl] = useState(`${process.env.NEXT_PUBLIC_SERVER_URL}/audio/${fileName}`);

  // const metadata = getMetadata(url); //TODO:呼び出そうとバグるからDynamoDBに一回入れる必要あるかも
  // console.log(metadata);

  const handleFileChange = useCallback(() => {
    if (url !== `${process.env.NEXT_PUBLIC_SERVER_URL}/audio/${fileName}`) {
      setUrl(`${process.env.NEXT_PUBLIC_SERVER_URL}/audio/${fileName}`);
      setPaused(false);
      setPosition(0);
    }
  }, [fileName, url]);

  useEffect(() => {
    if (position === duration) {
      handleNext(fileId);
    }
  });

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
  const mainIconColor = theme.palette.mode === 'dark' ? '#fff' : '#000';
  const lightIconColor =
    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Box display="none">
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
      </Box>
      <Widget>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {imageUrl ? (
            <CoverImage>
              <Image width={100} height={100} alt={fileName} src={imageUrl} />
            </CoverImage>
          ) : null}
          <Box sx={{ ml: 1.5, minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              PsychoPhysics
            </Typography>
            <Typography noWrap>
              <b>{fileName?.split('.').slice(0, -1).join('.')}</b>
            </Typography>
            <Typography noWrap letterSpacing={-0.25}>
              デイドリーム・ポップ
            </Typography>
          </Box>
        </Box>
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: -2,
          }}
        >
          <TinyText>{formatDuration(position)}</TinyText>
          <TinyText>-{formatDuration(duration - position)}</TinyText>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: -1,
          }}
        >
          <IconButton aria-label="previous song" onClick={() => handlePrev(fileId)}>
            <FastRewindRounded fontSize="large" htmlColor={mainIconColor} />
          </IconButton>
          <IconButton aria-label={paused ? 'play' : 'pause'} onClick={() => setPaused(!paused)}>
            {paused ? (
              <PlayArrowRounded sx={{ fontSize: '3rem' }} htmlColor={mainIconColor} />
            ) : (
              <PauseRounded sx={{ fontSize: '3rem' }} htmlColor={mainIconColor} />
            )}
          </IconButton>
          <IconButton aria-label="next song" onClick={() => handleNext(fileId)}>
            <FastForwardRounded fontSize="large" htmlColor={mainIconColor} />
          </IconButton>
        </Box>
        <Stack spacing={2} direction="row" sx={{ mb: 1, px: 1 }} alignItems="center">
          <VolumeDownRounded htmlColor={lightIconColor} />
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
          <VolumeUpRounded htmlColor={lightIconColor} />
        </Stack>
      </Widget>
      {/* <WallPaper /> */}
    </Box>
  );
}
