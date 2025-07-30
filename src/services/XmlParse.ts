import {XMLParser} from 'fast-xml-parser';

const parseConfig = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
};

export const parser = new XMLParser(parseConfig);
