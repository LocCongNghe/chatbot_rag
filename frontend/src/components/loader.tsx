import { BeatLoader } from 'react-spinners'
export const Loader = ({
className,
size = 7,
}: {
className?: string
size?: number
}) => (
<div
className={`flex items-center justify-center ${className || 'ml-4'}
p-6 bg-opacity-40 bg-gray-800 rounded-full shadow-2xl transition-all duration-500 ease-in-out transform hover:scale-105 hover:bg-opacity-100`}
>
<BeatLoader size={size} color="#4A90E2" />
</div>
)