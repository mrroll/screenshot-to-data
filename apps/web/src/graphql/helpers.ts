import { type GraphQLResolveInfo, type SelectionSetNode } from 'graphql';

type TBooleanMap = {
  [key: string]: boolean | TBooleanMap;
};

const getQueryShapeFromNodes = (nodes: SelectionSetNode | undefined) => {
  const result: TBooleanMap = {};

  nodes?.selections.forEach((selection, index) => {
    if ('name' in selection && selection.name.value !== '__typename') {
      if (
        'selectionSet' in selection &&
        typeof selection.selectionSet !== 'undefined'
      ) {
        result[selection.name.value] = getQueryShapeFromNodes(
          selection.selectionSet,
        );

        return;
      }

      result[selection.name.value] = true;
    }
  });

  return result;
};

const getQueryShapeFromInfo = (
  info: GraphQLResolveInfo,
  nestedKey?: string,
) => {
  const nodes = info.fieldNodes[0]?.selectionSet;

  const queryShapeFromNodes = getQueryShapeFromNodes(nodes);

  if (
    typeof nestedKey !== 'undefined' &&
    Object.keys(queryShapeFromNodes).find((value) => value === nestedKey) &&
    typeof queryShapeFromNodes[nestedKey] === 'object'
  ) {
    return queryShapeFromNodes[nestedKey] as TBooleanMap;
  }

  return queryShapeFromNodes;
};

const transformQueryShapeToPrismaSelect = (object: TBooleanMap) => {
  const result: TBooleanMap = {};

  for (const key in object) {
    const value = object[key];

    if (typeof value === 'undefined') {
      throw new Error('value is not defined');
    }

    if (typeof value !== 'boolean') {
      result[key] = { select: transformQueryShapeToPrismaSelect(value) };
    } else {
      result[key] = value;
    }
  }

  return result;
};

export const getPrismaSelectFromInfo = (
  info: GraphQLResolveInfo | undefined,
) => {
  if (typeof info === 'undefined') {
    return {};
  }

  const queryShapeFromInfo = getQueryShapeFromInfo(info);

  return transformQueryShapeToPrismaSelect(queryShapeFromInfo);
};
