export class PodcastChannel implements Auth {
  readonly rssId: number;
  readonly title: string;
  readonly auth: string;
  readonly image: string;
  readonly description: string;
  readonly episodes: number;
  readonly items: ItemPodcast[];

  constructor(item: XmlPodcast, idRss: number) {
    this.rssId = idRss;
    this.title = this.typeOfStringOfCdata(item.rss.channel.title);
    this.auth = this.typeOfStringOfCdata(item.rss.channel['itunes:author']);
    this.image = item.rss.channel['itunes:image']['@_href'];
    this.description = this.typeOfStringOfCdata(item.rss.channel.description);
    this.episodes = this.itemsLength(item.rss.channel.item);
    this.items = item.rss.channel.item;
  }

  private typeOfStringOfCdata(element: string | CData) {
    if (typeof element === 'string') {
      return element;
    }
    return element['#cdata-section'];
  }
  private itemsLength(element: ItemPodcast[] | undefined) {
    if (element === undefined) {
      return 0;
    }
    return element.length;
  }
}
