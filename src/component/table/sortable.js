import { useMemo, useState } from 'react'
import { SortAscendingIcon, SortDescendingIcon } from '@heroicons/react/solid'

//
// Simple sortable react helper. Include this in your component like this:
//
// function Component({items}) {
//   const { items, requestSort, getSortIconFor } = useSortableData(items)
//
//   return <table>
//     <thead></thead>
//     <tbody>{items.map((item) => {...})}</tbody>
//   </table>
// }
//
// You can pass an additional sortMap if the values you are accessing are not plain JS types:
//
// const sortMap = {
//   price: (value) => {
//     return value.format()
//   }
// }
//
// Then pass the sortMap to `useSortableData` as the second parameter.
//
export function useSortableData(items, sortMap = {}, config = null) {
  const [sortConfig, setSortConfig] = useState(config)

  const sortedItems = useMemo(() => {
    let sortableItems = [...items]

    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const sorter = sortMap[sortConfig.key]

        a = sorter ? sorter(a[sortConfig.key]) : a[sortConfig.key]
        b = sorter ? sorter(b[sortConfig.key]) : b[sortConfig.key]

        if (a < b) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (a > b) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    return sortableItems
  }, [items, sortConfig])

  const resetSort = (e) => {
    e.stopPropagation()
    setSortConfig({})
  }

  function requestSort(key) {
    let direction = 'asc'
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  function getSortIconFor(name) {
    if (!sortConfig) return

    if (sortConfig.key !== name) return

    if (sortConfig.direction === 'asc')
      return <SortAscendingIcon className="h-4 w-4 ml-2" />

    return <SortDescendingIcon className="h-4 w-4 ml-2" />
  }

  return {
    items: sortedItems,
    requestSort,
    sortConfig,
    resetSort,
    getSortIconFor
  }
}
