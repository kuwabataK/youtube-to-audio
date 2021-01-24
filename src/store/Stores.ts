import YoutubeStore from '@/store/youtubeStore/YoutubeStore'

/**
 * このプロジェクトで利用するStoreのMapリスト
 */
export const StoreIndex = {
  YoutubeStore,
}

export type StoresType = typeof StoreIndex

/**
 * StoreIndexからStoreの実体のみを抽出したMapを返す
 */
const GeneratedStores = () => {
  const result: {[key: string]: any} = {}
  Object.entries(StoreIndex).forEach(([key, val]) => {
    result[key] = val.value
  })
  return result as Partial<{ [K in keyof StoresType]: StoresType[K]['value'] }>
}

export default GeneratedStores
