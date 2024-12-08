import { Sources } from './sources'
import { ChatMessageType } from '../../types'
interface AnswerMessageProps {
text: ChatMessageType['content']
sources: ChatMessageType['sources']
onSourceClick: (source: string) => void
}
export const AnswerMessage: React.FC<AnswerMessageProps> = ({
text,
sources,
onSourceClick,
}) => {
return (
<div className="mb-4 p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
{/* Header Section */}
<header className="flex flex-row justify-between mb-8">
<div className="flex flex-row justify-center align-middle items-center">
<div className="flex flex-col justify-start">
{/* Title */}
<h2 className="text-zinc-700 text-3xl font-bold leading-9 hover:text-blue-600 transition-colors duration-300">
Phản hồi
</h2>
{/* Subtitle */}
<p className="text-zinc-400 text-sm font-medium hover:text-blue-500 transition-colors duration-300">
Được cung cấp và hỗ trợ bởi <b>Elasticsearch</b>
</p>
</div>
</div>
</header>
{/* Text Content */}
{text && (
<div
className="text-base leading-tight text-gray-800 whitespace-pre-wrap mb-8"
dangerouslySetInnerHTML={{ __html: text }}
></div>
)}
{/* Sources Section */}
{sources && (
<Sources
showDisclaimer
sources={sources}
onSourceClick={onSourceClick}
/>
)}
</div>
)
}