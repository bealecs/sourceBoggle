export const Loading = () => {
  return (
    <div className="flex-col h-screen items-center content-center">
    <div className="flex justify-center bg-black">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
    <h1 className="text-blue-500 text-3xl text-center my-12">Loading....</h1>
    </div>
  );
};
