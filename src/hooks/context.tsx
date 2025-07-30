import {useState, useContext, createContext} from 'react';

const ContextPodcastDefault = {
  isPodcast: false,
  title: '',
  urlPod: '',
  authPod: '',
  cover: '',
  isShared: false,
  setIsPodcast: (newIsPodcast: boolean) => {},
  setTitle: (newTitle: string) => {},
  setUrlPod: (newUrlPod: string) => {},
  setCover: (newAuthPod: string) => {},
  setAuthPod: (newAuthPod: string) => {},
  setShared: (newIsShared: boolean) => {},
};
const ContextPodcast = createContext(ContextPodcastDefault);

export const ContextProvider = ({children}: any) => {
  const [isPodcast, setIsPodcast] = useState(false);
  const [title, setTitle] = useState('');
  const [urlPod, setUrlPod] = useState('');
  const [authPod, setAuthPod] = useState('');
  const [cover, setCover] = useState('');
  const [isShared, setShared] = useState(false);

  const value = {
    isPodcast,
    title,
    urlPod,
    authPod,
    cover,
    isShared,
    setTitle,
    setIsPodcast,
    setUrlPod,
    setAuthPod,
    setCover,
    setShared,
  };
  return (
    <ContextPodcast.Provider value={value}>{children}</ContextPodcast.Provider>
  );
};

export const UseGlobalStates = () => {
  const context = useContext(ContextPodcast);
  if (context === undefined) {
    throw new Error('UseGlobalStates deve ser usado dentro do provedor');
  }
  return context;
};
