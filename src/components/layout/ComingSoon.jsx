const ComingSoon = () => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#3A7BFF' }}>
          <span className="text-6xl">🚀</span>
        </div>
        <h1 className="text-4xl font-bold mb-4" style={{ color: '#3A7BFF' }}>Coming Soon</h1>
        <p className="text-gray-600 text-lg">This feature is under development</p>
      </div>
    </div>
  );
};

export default ComingSoon;
