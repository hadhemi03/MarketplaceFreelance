const MessageSkeleton = () => {
    // Create an array of 6 items for skeleton messages
    const skeletonMessages = Array(6).fill(null);
  
    return (
      <div className="flex-grow-1 overflow-auto p-4">
        {skeletonMessages.map((_, idx) => (
          <div key={idx} className={`d-flex ${idx % 2 === 0 ? "justify-content-start" : "justify-content-end"} mb-3`}>
            <div className="d-flex align-items-center">
              <div className="skeleton w-100 h-100 rounded-circle bg-light" />
            </div>
  
            <div className="ms-2">
              <div className="skeleton h-4 w-25 mb-2 bg-light" />
              <div className="skeleton h-16 w-100 bg-light" />
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default MessageSkeleton;
  