import React, { useState } from 'react'
import {
  actions,
  AppStatus,
  thunkActions,
  useAppDispatch,
  useAppSelector,
} from 'store/provider'
import { Header } from 'components/header'
import { Chat } from 'components/chat/chat'
import SearchInput from 'components/search_input'
import { ReactComponent as ChatIcon } from 'images/chat_icon.svg'
import { ReactComponent as ElasticLogo } from 'images/elastic_logo.svg'
import { SearchResults } from './components/search_results'
const App = () => {
  const dispatch = useAppDispatch()
  const status = useAppSelector((state) => state.status)
  const sources = useAppSelector((state) => state.sources)
  const [summary, ...messages] = useAppSelector((state) => state.conversation)
  const hasSummary = useAppSelector(
    (state) => !!state.conversation?.[0]?.content
  )
  const [searchQuery, setSearchQuery] = useState<string>('')
  const handleSearch = (query: string) => {
    dispatch(thunkActions.search(query))
  }
  const handleSendChatMessage = (query: string) => {
    dispatch(thunkActions.askQuestion(query))
  }
  const handleAbortRequest = () => {
    dispatch(thunkActions.abortRequest())
  }
  const handleToggleSource = (name) => {
    dispatch(actions.sourceToggle({ name }))
  }
  const handleSourceClick = (name) => {
    dispatch(actions.sourceToggle({ name, expanded: true }))
    setTimeout(() => {
      document
        .querySelector(`[data-source="${name}"]`)
        ?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }
  const suggestedQueries = [
    'Vợ bảo tôi vô tâm',
    "Vợ bảo ăn gì cũng được ",
    'Anh chả thương em',
    'Em béo lắm hả anh?',
    'Nếu mẹ anh và em cùng rơi xuống nước, anh sẽ cứu ai trước?',
  ]
  return (
    <>
      <Header />
      <div className="p-6 max-w-3xl mx-auto bg-gradient-to-r from-blue-100 to-teal-100 shadow-md rounded-lg">
        <SearchInput
          onSearch={handleSearch}
          value={searchQuery}
          appStatus={status}
        />
        {status === AppStatus.Idle ? (
          <div className="mx-auto my-6">
            <h2 className="text-zinc-600 text-sm font-medium mb-3 inline-flex items-center gap-2">
              <ChatIcon /> Câu hỏi thường gặp
            </h2>
            <div className="flex flex-col space-y-4">
              {suggestedQueries.map((query) => (
                <button
                  key={query}
                  className="hover:-translate-y-1 hover:shadow-lg hover:bg-zinc-200 transition-all h-12 px-4 py-2 bg-zinc-100 rounded-md shadow flex items-center text-zinc-700"
                  onClick={(e) => {
                    e.preventDefault()
                    setSearchQuery(query)
                    handleSearch(query)
                  }}
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {hasSummary ? (
              <div className="max-w-3xl mx-auto relative bg-white rounded-md p-6">
                <Chat
                  status={status}
                  messages={messages}
                  summary={summary}
                  onSend={handleSendChatMessage}
                  onAbortRequest={handleAbortRequest}
                  onSourceClick={handleSourceClick}
                />
                <SearchResults
                  results={sources}
                  toggleSource={handleToggleSource}
                />
              </div>
            ) : (
              <div className="h-36 p-6 bg-white rounded-md shadow flex flex-col justify-start items-center gap-4 mt-6">
                <ElasticLogo className="w-16 h-16" />
                <p className="text-center text-zinc-400 text-sm">
                  Đang suy nghĩ câu trả lời...
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
export default App