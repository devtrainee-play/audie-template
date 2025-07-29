export class PodcastEpisode implements Episode {
  readonly id: string;
  readonly title: string;
  readonly image: string;
  readonly summary: string;
  readonly description: string;
  readonly duration: string;
  readonly url: string;
  readonly auth: string;
  readonly rssId: number;

  constructor(item: ItemPodcast, auth: any, rssId: any) {
    this.id = this.guildId(item.guid);
    this.title = this.typeOfStringOfCdata(item.title);
    this.image = item['itunes:image']['@_href'];
    this.summary = this.typeOfStringOfCdata(item['itunes:summary']);
    this.description = this.typeOfStringOfCdata(item.description);
    this.duration = this.durationCalculator(item['itunes:duration']);
    this.url = item.enclosure['@_url'];
    this.auth = auth;
    this.rssId = rssId;
  }

  private guildId(element: string | Guid) {
    if (typeof element === 'string') {
      return element;
    }
    return element['#text'];
  }

  private typeOfStringOfCdata(element: string | CData) {
    if (typeof element === 'string') {
      return element;
    }
    if (element === undefined) {
      return element as string;
    }
    return element['#cdata-section'];
  }

  private durationCalculator(element: string | number) {
    if (typeof element === 'number') {
      const hour = Math.floor(element / 3600);
      const minutes = Math.floor((element % 3600) / 60);
      const seconds = Math.floor(element % 60);
      const formatHour = this.formateDuration(hour);
      const formatMinutes = this.formateDuration(minutes);
      const formatSeconds = this.formateDuration(seconds);

      return `${formatHour}:${formatMinutes}:${formatSeconds}`;
    }
    return element;
  }
  private formateDuration(element: number) {
    if (element > 0 && element < 10) {
      return `0${element}`;
    }
    if (element > 10) {
      return `${element}`;
    }
    return '00';
  }
}
