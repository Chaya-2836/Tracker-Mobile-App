import { fetchTopByDimension } from './commonService.js';

export const fetchTopMediaSources = async (params) => {
  return fetchTopByDimension({
    ...params,
    dimension: 'media_source',
    nameAlias: 'name'
  });
};
