import { useUser } from '@clerk/clerk-react';
import { SquarePen, Hash, Image, Eraser, Scissors, FileText, type LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

 interface AiTool {
    title: string;
        description: string;
        Icon: LucideIcon,
        bg: { from: string; to: string };
        path: string;
 }

 const AiToolsData: AiTool[] = [
    {
        title: 'AI Article Writer',
        description: 'Generate high-quality, engaging articles on any topic with our AI writing technology.',
        Icon: SquarePen,
        bg: { from: '#3588F2', to: '#0BB0D7' },
        path: '/ai/write-article'
    },
    {
        title: 'Blog Title Generator',
        description: 'Find the perfect, catchy title for your blog posts with our AI-powered generator.',
        Icon: Hash,
        bg: { from: '#B153EA', to: '#E549A3' },
        path: '/ai/blog-titles'
    },
    {
        title: 'AI Image Generation',
        description: 'Create stunning visuals with our AI image generation tool, Experience the power of AI ',
        Icon: Image,
        bg: { from: '#20C363', to: '#11B97E' },
        path: '/ai/generate-images'
    },
    {
        title: 'Background Removal',
        description: 'Effortlessly remove backgrounds from your images with our AI-driven tool.',
        Icon: Eraser,
        bg: { from: '#F76C1C', to: '#F04A3C' },
        path: '/ai/remove-background'
    },
    {
        title: 'Object Removal',
        description: 'Remove unwanted objects from your images seamlessly with our AI object removal tool.',
        Icon: Scissors,
        bg: { from: '#5C6AF1', to: '#427DF5' },
        path: '/ai/remove-object'
    },
    {
        title: 'Resume Reviewer',
        description: 'Get your resume reviewed by AI to improve your chances of landing your dream job.',
        Icon: FileText,
        bg: { from: '#12B7AC', to: '#08B6CE' },
        path: '/ai/review-resume'
    }
]

const AiTools = () => {
    const navigate = useNavigate();
    const {user} = useUser();
  return (
    <div className='px-4 sm:px-20 xl:px-32 my-24'>
        <div className='text-center'>
           <h2 className='text-slate-700 text-[42px] font-semibold '>
             Powerful AI Tools
           </h2>
           <p>Everything you need to create, enhance, and optimize your content with cuttong-edge AI technology.</p>
        </div>
      <div className='flex flex-wrap mt-10 justify-center'>
        {
            AiToolsData.map((tool, index) => (
                <div key={index} className='p-8 m-4 max-w-xs rounded-lg bg-[#FDFDFE] shadow-lg border border-gray-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer' onClick={() => user && navigate(tool.path)}>
                   <tool.Icon className='w-12 h-12 p-3 text-white rounded-xl' style={{background: `linear-gradient(to bottom, ${tool.bg.from}, ${tool.bg.to})`}} />
                   <h3 className='mt-6 mb-3 text-lg font-semibold'>{tool.title}</h3>
                   <p className='text-gray-400 text-sm max-w-[95%]'>{tool.description}</p>
                </div>
            ))
        }
      </div>
    </div>
  )
}

export default AiTools
