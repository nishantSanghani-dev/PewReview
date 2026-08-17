import { useMemo, useState } from 'react';

const areSortsEqual = (currentSort = [], nextSort = []) => {
  if (currentSort.length !== nextSort.length) {
    return false;
  }

  return currentSort.every((item, index) => {
    const nextItem = nextSort[index] || {};
    return item.field === nextItem.field && item.dir === nextItem.dir;
  });
};

export default function useGridPagination(initialTake = 10) {
  const [dataState, setDataState] = useState({
    skip: 0,
    take: initialTake,
    sort: [],
  });

  const onDataStateChange = (event) => {
    const nextDataState = event.dataState || {};
    const nextSort = nextDataState.sort || [];

    setDataState((prev) => {
      if (
        prev.skip === nextDataState.skip &&
        prev.take === nextDataState.take &&
        areSortsEqual(prev.sort || [], nextSort)
      ) {
        return prev;
      }

      return {
        ...nextDataState,
        sort: nextSort,
      };
    });
  };

  const resetPage = () => {
    setDataState((prev) => ({
      ...prev,
      skip: 0,
    }));
  };

  const page = Math.floor(dataState.skip / dataState.take) + 1;
  const pageSize = dataState.take;
  const kendoSort = useMemo(() => dataState.sort || [], [dataState.sort]);
  const sort = useMemo(
    () =>
      (kendoSort || []).map((item) => ({
        field: item.field,
        direction: item.dir === 'asc' ? 0 : 1,
      })),
    [kendoSort]
  );

  const setKendoSort = (nextSort = []) => {
    setDataState((prev) => {
      if (areSortsEqual(prev.sort || [], nextSort)) {
        return prev;
      }

      return {
        ...prev,
        sort: nextSort,
      };
    });
  };

  return {
    dataState,
    setDataState,
    onDataStateChange,
    resetPage,
    page,
    pageSize,
    sort,
    kendoSort,
    setKendoSort,
  };
}
