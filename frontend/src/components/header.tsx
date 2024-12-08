import elasticTypeMark from 'images/elasticTypeMark.png'
export const Header = () => (
<div className="flex flex-row justify-between items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-500 w-full shadow-lg">
<div className="pr-8 border-r border-ink">
<a href="/">
<img
width={118}
height={40}
src={elasticTypeMark}
alt="Logo"
className="transition-transform duration-300 ease-in-out hover:scale-105"
/>
</a>
</div>
{/* Optionally add navigation items to the header */}
<div className="flex space-x-8 text-white">
<a href="/" className="text-lg hover:text-gray-200 transition-all duration-200">Trang chủ</a>
<a href="/about" className="text-lg hover:text-gray-200 transition-all duration-200">Thông tin</a>
<a href="/services" className="text-lg hover:text-gray-200 transition-all duration-200">Dịch vụ</a>
<a href="/contact" className="text-lg hover:text-gray-200 transition-all duration-200">Liên hệ</a>
</div>
</div>
)