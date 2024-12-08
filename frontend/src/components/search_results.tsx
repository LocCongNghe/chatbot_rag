import React, { Fragment } from 'react'
import { ReactComponent as LightBulb } from 'images/light_bulb_icon.svg'
import { SourceType } from '../types'
import { SourceIcon } from './source_icon'
import { SearchResult } from './search_result'
interface SearchResultsProps {
results: SourceType[]
toggleSource: (source: string) => void
}
export const SearchResults: React.FC<SearchResultsProps> = ({
results,
toggleSource,
}) =>
!!results?.length ? (
<>
<h2 className="text-zinc-600 text-lg font-semibold mb-4 flex items-center gap-3">
<LightBulb className="text-yellow-500" />
<span>Search Results</span>
</h2>
<div className="flex flex-col gap-y-6">
{results?.map((result) => (
<SearchResult
key={result.name}
toggleSource={toggleSource}
{...result}
/>
))}
</div>
</>
) : (
<div className="flex justify-center items-center text-zinc-500 text-sm py-8">
<p>No results found</p>
</div>
)