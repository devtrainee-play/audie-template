import {api} from '@/config/axios';

interface Result {
  id: number;
  url: string;
}

interface Response {
  success: boolean;
  data: Result;
}
export async function getEpisodePodcast(id: number) {
  const response = await api.get<Response>(`/api/v1/Podcast/${id}`);

  return response.data.data;
}
