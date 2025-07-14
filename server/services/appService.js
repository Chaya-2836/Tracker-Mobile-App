import { fetchTopByDimension } from './commonService.js';
export const fetchTopApps = async (params) => {
    return fetchTopByDimension({
      ...params,
      dimension: 'sub_param_1',
      nameAlias: 'name'
    });
  };
  