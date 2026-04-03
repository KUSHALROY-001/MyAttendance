const ItemNotFound = ({ item }) => {
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-50 pb-20">
      <h2 className="text-xl font-bold text-gray-800 mb-2">{item} Not Found</h2>
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition"
      >
        Go Back
      </button>
    </div>
  );
};

export default ItemNotFound;
