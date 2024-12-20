import React, { useEffect, useRef, useState } from 'react'
import { SourceIcon } from './source_icon'
import { SourceType } from '../types'
import { ReactComponent as ArrowDown } from 'images/chevron_down_icon.svg'
interface SearchResultProps extends SourceType {
toggleSource: (source: string) => void
}
const TITLE_HEIGHT = 59
export const SearchResult: React.FC<SearchResultProps> = ({
name,
icon,
url,
summary,
updated_at,
expanded,
toggleSource,
}) => {
const ref = useRef<HTMLDivElement>(null)
const [blockHeight, setBlockHeight] = useState<string | number>(0)
// Prevent expand when click is on link
const onToggle = (event) => !event.target.href && toggleSource(name)
useEffect(() => {
const blockHeight = ref.current?.clientHeight
if (blockHeight) {
setBlockHeight(blockHeight)
}
}, [summary])
const updatedAtDate = new Date(updated_at || '')
return (
<div className="flex flex-col">
<div
onClick={onToggle}
className="ease-in-out duration-300 overflow-hidden cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-transform"
style={{ height: `${expanded ? blockHeight : TITLE_HEIGHT}px` }}
>
<div
className="p-4 grid grid-cols-[auto_auto] gap-3 items-start overflow-hidden"
data-source={name}
ref={ref}
>
<SourceIcon
className="bg-gray-100 rounded-md flex justify-center items-center px-2 py-1 text-slate-400 text-xs"
icon={icon}
/>
<div className="inline-flex gap-4 justify-between overflow-hidden">
<h4 className="flex flex-row space-x-1.5 pb-2 text-md mb-1 font-semibold overflow-ellipsis overflow-hidden whitespace-nowrap text-blue-600 text-lg">
{name}
</h4>
<ArrowDown
className={`ease-in-out duration-300 transform ${
expanded ? 'rotate-180' : 'rotate-0'
}`}
/>
</div>
<span className="bg-gray-100 rounded-md flex justify-center px-2 py-1 text-slate-400 text-xs">
URL
</span>
<a
className="hover:text-blue-800 text-blue-600 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap"
target="_blank"
rel="noreferrer"
href={url}
>
{url}
</a>
{summary?.map((text, index) => (
<React.Fragment key={index}>
<span className="bg-gray-100 rounded-md flex justify-center px-2 py-1 text-slate-400 text-xs">
Snippet
</span>
<p className="text-sm mb-2 overflow-ellipsis text-black">
...{text}
</p>
</React.Fragment>
))}
</div>
</div>
{updated_at && (
<span className="self-end mt-2 text-zinc-500 text-xs tracking-tight font-medium uppercase">
{`UPDATED ${updatedAtDate.toLocaleDateString('default', {
month: 'short',
})} ${updatedAtDate.toLocaleDateString('default', {
day: 'numeric',
})}, ${updatedAtDate.getFullYear()}`}
</span>
)}
</div>
)
}