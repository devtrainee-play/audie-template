/// <reference types="nativewind/types" />

type RouteName =
  | 'Home'
  | 'Promotions'
  | 'News'
  | 'ProfileUser'
  | 'SheetPromotion'
  | 'Television'
  | 'Podcast';

type RootTabParamList = {
  MainScreen: undefined;
  WelcomeScreen: undefined;
  Home: undefined;
  News: {categoryId?: number};
  Promotions: undefined;
  ProfileUser: {refresh: boolean};
  SheetNews: any;
  SheetPromotion: {promotiom: Promotiom};
  PersonalData: {refresh: boolean} | undefined;
  ManageLevel: undefined;
  SocialMedia: undefined;
  About: undefined;
  ContractInformation: undefined;
  BirthdayAndGender: undefined;
  Address: undefined;
  Welcome: undefined;
  RegisterUser: {phoneNumber: string};
  LoginOrRegister: undefined;
  OTPVerification: {phoneNumber: string};
  Podcast: undefined;
  Channels: undefined;
  Episodes: {auth: Auth};
  SheetEpisode: {episode: Episode};
  MainPodcast: undefined;
};
interface Episode {
  id: string;
  title: string;
  image: string;
  summary: string;
  description: string;
  duration: string;
  url: string;
  auth: string;
  rssId: number;
}
interface Auth {
  rssId: number;
  title: string;
  auth: string;
  image: string;
  description: string;
  episodes: number;
  items: ItemPodcast[];
}
interface XmlPodcast {
  rss: {
    channel: Channel;
  };
}
interface Channel {
  title: string | CData;
  link: string | AtomLink;
  description: string | CData;
  language?: string;
  copyright?: string;
  lastBuildDate?: string;
  generator?: string;
  managingEditor?: string;
  'atom:link'?: AtomLink | AtomLink[];
  'itunes:author': string | CData;
  'itunes:summary': string | CData;
  'itunes:type': 'episodic' | 'serial';
  'itunes:owner': ItunesOwner;
  'itunes:explicit': 'true' | 'false' | 'yes' | 'no';
  'itunes:category': ItunesCategory | ItunesCategory[];
  'itunes:image': ItunesImage;
  'itunes:block'?: 'yes' | 'no';
  'googleplay:author'?: string;
  'googleplay:image'?: ItunesImage;
  'googleplay:category'?: {'@_text': string};
  image?: Image;
  item: ItemPodcast[];
}
interface ItemPodcast {
  title: string | CData;
  link: string;
  description: string | CData;
  pubDate: string;
  guid: string | Guid;
  enclosure: Enclosure;

  'itunes:duration': string | number;
  'itunes:summary': string | CData;
  'itunes:explicit': 'true' | 'false' | 'yes' | 'no';
  'itunes:image': ItunesImage;
  'itunes:episodeType': 'full' | 'trailer' | 'bonus';
  'itunes:episode'?: string | number;

  'dc:creator'?: string | CData;
}
type CData = {
  '#cdata-section': string;
};

interface Enclosure {
  '@_url': string;
  '@_length': string;
  '@_type': 'audio/mpeg' | 'audio/aac' | 'audio/x-m4a' | string;
}
interface ItunesImage {
  '@_href': string;
}

interface Image {
  url: string;
  title: string | CData;
  link: string;
}
interface ItunesOwner {
  'itunes:name': string | CData;
  'itunes:email': string;
}

interface ItunesCategory {
  '@_text': string;
  'itunes:category'?: ItunesCategory;
}

interface AtomLink {
  '@_href': string;
  '@_rel': 'self' | 'hub' | string;
  '@_type'?: string;
}

interface Guid {
  '#text': string;
  '@_isPermaLink'?: 'true' | 'false';
}
interface ItemUrl {
  id: number;
  url: string;
}

interface UserPreferences {
  savedNews: News[];
  firstAccess: boolean;
  themeMode: ColorSchemeSystem | null;
}
interface ExtraData {
  apiKey: any;
  appName: any;
  createdAt: any;
  displayName: any;
  email: string;
  emailVerified: any;
  gender: number;
  isAnonymous: any;
  lastLogin: any;
  lastLoginAt: any;
  phoneNumber: string;
  photoURL: any;
  provider: any;
  uid: any;
  userId: any;
}

interface UserInfo {
  createTime: string;
  dateJoined: string;
  id: number;
  isActive: boolean;
  lastLogin: string;
  provider: any;
  station: any;
  extraData: ExtraData;
  stationId: number;
  uid: any;
  updateTime: string;
  userId: string;
}

interface Rules {
  ageStart: number;
  ageEnd: number;
  rangeAge: boolean;
  operatorBetweenAges: boolean;
  operatorBetween: string | null;
  state: string | null;
  neighborhood: string | null;
  city: string | null;
  gender: string | null;
}

interface PromotionRules {
  id: number;
  promotionId: number;
  rules: Rules;
  isActive: boolean;
  createTime: string;
  updateTime: string;
  stationId: number;
  station: string | null;
}

interface Promotiom {
  id: number;
  stationId: number;
  localId: number;
  description: string;
  title: string;
  image: string;
  imageUrl: string;
  isAd: boolean;
  position: number;
  externalUrl: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  dateUndefined: boolean;
  promotionRules: PromotionRules;
}

interface PlaylistXML {
  _attributes: {CurrentTime: string};
  Playlist: {
    OnAir: {
      RDS: {
        ProgrammeServiceName: string | null;
        RadioText: string;
      };
      Break: {
        Id: {_text: string};
        Op: string;
        SchedTime: string;
        StartedTime: string;
        Type: {_text: string};
        InsCount: number;
        MusicCount: number;
        Dur: string;
        SchedEnd: string;
        ShedPause: string | null;
      };
      CurIns: {
        StartedTime: string;
        Id: string | null;
        Name: string;
        Type: string;
        Folder: string;
        Filename: string;
        Dur: string;
        Intro: string | null;
        Bitrate: number;
        MD5: {_text: string};
        ID3: {
          Title: string;
          Subtitle: string;
          Artist: string;
          Album: string;
          Track: string;
          Publisher: string;
          Year: string;
          Comment: string;
          Language: string;
          Genre: string;
          RingTone: string;
          URLCover: string;
        };
      };
      CurMusic: {
        StartedTime: string;
        Id: string | null;
        Title: {_text: string};
        Subtitle: string | null;
        Artist: {_text: string};
        Album: {_text: string} | null;
        Track: string | null;
        Publisher: string | null;
        Year: string | null;
        Comment: string | null;
        Language: string | null;
        Genre: string | null;
        RingTone: string | null;
        URLCover: string | null;
      };
    };
    Next: {
      NextIns: {
        Ins: {
          _attributes: {
            SchedTime: string;
            Id: string;
            Type: string;
            Name: string;
            Folder: string;
            Filename: string;
            Dur: string;
            Intro: string | null;
            Bitrate: number;
          };
        }[];
      };
      NextMusic: {
        Music: {
          SchedTime: string;
          Id: string | null;
          Title: string;
          Dur: string;
          Intro: string | null;
          Artist: string;
          Album: string | null;
          Track: string | null;
          Publisher: string | null;
          Year: string | null;
          Comment: string | null;
          Language: string | null;
          Genre: string | null;
          RingTone: string | null;
          URLCover: string | null;
        };
      };
    };
  };
}
