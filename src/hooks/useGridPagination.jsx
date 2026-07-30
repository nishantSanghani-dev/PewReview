import { useState } from 'react'

export default function useGridPagination(initialTake = 10) {
  const [dataState, setDataState] = useState({
    skip: 0,
    take: initialTake,
  })

  const onDataStateChange = (event) => {
    setDataState(event.dataState)
  }

  const resetPage = () => {
    setDataState((prev) => ({
      ...prev,
      skip: 0,
    }))
  }

  const page = Math.floor(dataState.skip / dataState.take) + 1
  const pageSize = dataState.take

  return {
    dataState,
    setDataState,
    onDataStateChange,
    resetPage,
    page,
    pageSize,
  }
}
