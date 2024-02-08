'use client';

import { useEffect, useState } from 'react';
import { Drawer, DrawerContent, DrawerFooter, DrawerTrigger } from '@/components/ui/drawer';
import Player from './Player';
import { _Object } from '@aws-sdk/client-s3';
import { AudioLines } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';

interface PlayerModalProps {
  validUrls: string[];
  audioFilenameList: string[];
  productName: string;
  productOwner: string;
  metadata: { [k: string]: string }[];
}

const PlayerModal = ({
  validUrls,
  audioFilenameList,
  productName,
  productOwner,
  metadata,
}: PlayerModalProps) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(audioFilenameList[0]);
  const [fileId, setFileId] = useState(0);
  const handleSelectSoundFile = (fileName: string, id: number) => {
    setSelectedFileName(fileName);
    setFileId(id);
  };
  const handlePrev = (id: number) => {
    if (id !== 0 && audioFilenameList) {
      handleSelectSoundFile(audioFilenameList[id - 1] ?? '', id - 1);
    }
  };
  const handleNext = (id: number) => {
    if (audioFilenameList && id !== audioFilenameList?.length - 1) {
      handleSelectSoundFile(audioFilenameList[id + 1] ?? '', id + 1);
    }
  };

  const closeModalHandler = () => {
    setSelectedFileName(null);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Drawer>
      <DrawerTrigger>
        <div className="mt-6 flex items-center">
          <AudioLines />
          <p className="ml-2 text-sm text-muted-foreground">視聴する</p>
        </div>
      </DrawerTrigger>
      <DrawerContent className="flex">
        <div className="mx-auto w-full max-w-sm">
          {isMounted ? (
            <div>
              <div>
                <Player
                  bucket="digital-ec-audio-bucket"
                  fileName={selectedFileName ?? ''}
                  handleNext={handleNext}
                  handlePrev={handlePrev}
                  fileId={fileId}
                  imageUrl={validUrls[0]}
                  productName={productName}
                  productOwner={productOwner}
                  metadata={metadata[fileId]}
                />
              </div>
              <div>
                <ScrollArea className="h-48 rounded-md border">
                  <div className="p-4">
                    <h4 className="mb-4 text-sm font-medium leading-none">Music List</h4>
                    {audioFilenameList.map((item, id) => (
                      <div key={id}>
                        <div
                          className="text-sm"
                          onClick={() => handleSelectSoundFile(item ?? '', id)}
                        >
                          <span
                            className={cn('text-black', {
                              'animate-text-shadow-drop-br': item === selectedFileName,
                              'font-bold': item === selectedFileName,
                            })}
                          >
                            {item}
                          </span>
                        </div>
                        <Separator className="my-2" />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          ) : null}
          <DrawerFooter></DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default PlayerModal;
