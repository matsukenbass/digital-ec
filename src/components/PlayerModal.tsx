'use client';

import { useEffect, useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import Player from './Player';
import { _Object } from '@aws-sdk/client-s3';
import { AudioLines, X } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

interface PlayerModalProps {
  objects: _Object[];
  validUrls: string[];
}

const PlayerModal = ({ objects, validUrls }: PlayerModalProps) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [fileId, setFileId] = useState(0);
  const handleSelectSoundFile = (fileName: string, id: number) => {
    setSelectedFileName(fileName);
    setFileId(id);
  };
  const handlePrev = (id: number) => {
    if (id !== 0 && objects) {
      handleSelectSoundFile(objects[id - 1].Key ?? '', id - 1);
    }
  };
  const handleNext = (id: number) => {
    if (objects && id !== objects?.length - 1) {
      handleSelectSoundFile(objects[id + 1].Key ?? '', id + 1);
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
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="flex items-center">
            <div>
              <DrawerTitle>Playlist</DrawerTitle>
              <DrawerDescription>聴きたいトラックをクリック</DrawerDescription>
            </div>
            {/* <div>
              <DrawerClose>
                <X onClick={closeModalHandler} />
              </DrawerClose>
            </div> */}
          </DrawerHeader>
          {isMounted ? (
            <div>
              <div>
                <Player
                  bucket="2023-autumn-pp-daydream-pop-for-listening"
                  fileName={selectedFileName ?? ''}
                  handleNext={handleNext}
                  handlePrev={handlePrev}
                  fileId={fileId}
                  imageUrl={validUrls[0]}
                />
              </div>
              <div>
                <ScrollArea className="rounded-md border">
                  <div className="p-4">
                    <h4 className="mb-4 text-sm font-medium leading-none">Music List</h4>
                    {objects.map((item, id) => (
                      <>
                        <div
                          key={id}
                          className="text-sm"
                          onClick={() => handleSelectSoundFile(item.Key ?? '', id)}
                        >
                          {item.Key === selectedFileName ? (
                            <span className="relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-green-500">
                              <span className="relative font-bold text-white">{item.Key}</span>
                            </span>
                          ) : (
                            <span>{item.Key}</span>
                          )}
                        </div>
                        <Separator className="my-2" />
                      </>
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
