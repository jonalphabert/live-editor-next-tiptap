import React from 'react';

export default ({ node }: { node: { attrs: any } }) => {
  const { username, theme } = node.attrs;
  
  return (
    <div className="github-stats my-4">
      {username ? (
        <img 
          src={`https://github-readme-stats.vercel.app/api?username=${username}&theme=${theme}&show_icons=true`}
          alt={`GitHub stats for ${username}`}
          className="rounded-lg"
        />
      ) : (
        <div className="bg-gray-100 border-2 border-dashed rounded-lg w-full h-48 flex items-center justify-center">
          <span className="text-gray-500">GitHub Stats Placeholder</span>
        </div>
      )}
    </div>
  );
};