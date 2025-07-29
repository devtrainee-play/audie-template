import {api} from '@/config/axios';

interface ItemUrl {
  id: number;
  url: string;
}

interface Result {
  totalItem: any;
  result: ItemUrl[];
}
interface Response {
  success: boolean;
  data: Result;
}
export async function getPodcastRss(page: number, size: number) {
  const response = await api.get<Response>(
    `/api/v1/Podcast?CurrentPage=${page}&PageSize=${size}`,
  );

  return response.data.data.result;
}
