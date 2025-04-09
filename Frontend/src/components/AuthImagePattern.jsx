const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="d-none d-lg-flex align-items-center justify-content-center bg-light p-5">
      <div className="text-center max-w-md">
        <div className="row row-cols-3 g-3 mb-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className={`col-4`}>
              <div
                className={`aspect-square rounded-2xl bg-primary opacity-10 ${
                  i % 2 === 0 ? "animate-pulse" : ""
                }`}
              />
            </div>
          ))}
        </div>
        <h2 className="fs-2 fw-bold mb-4">{title}</h2>
        <p className="text-muted">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
