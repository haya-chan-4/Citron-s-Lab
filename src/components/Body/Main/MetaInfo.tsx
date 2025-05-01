import dayjs from 'dayjs';

interface MetaInfoProps {
  publishedAt: string;
  category?: string;
}

const MetaInfo: React.FC<MetaInfoProps> = (props) => {
  const { publishedAt, category } = props
  const formattedDate = dayjs(publishedAt).format('YYYY.MM.DD');

  return (
    <div className="flex flex-wrap items-center text-sm text-gray-600 mb-8 space-x-4">
      <span>{formattedDate}</span>
      {category && (
        <span className="text-sm text-indigo-600 border border-indigo-600 rounded px-2 pt-[3px] pb-[2px] ">
          {category}
        </span>
      )}
    </div>
  );
};

export default MetaInfo;
