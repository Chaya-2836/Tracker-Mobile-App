import { fetchTopByDimension } from './commonService.js';
export const fetchTopAgencies = async (params) => {
    return fetchTopByDimension({
      ...params,
      dimension: 'agency',
      nameAlias: 'name'
    });
  };
  