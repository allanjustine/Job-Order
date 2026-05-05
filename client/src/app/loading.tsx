const Loading = () => {
  return (
    <div
      className={`fixed top-0 bottom-0 left-0 right-0 z-999 flex items-center justify-center bg-background`}
    >
      <iframe
        src="https://smctdevt.github.io/smctloder/"
        frameBorder="0"
        allowFullScreen
        style={{ width: "100%", height: "100%" }}
      ></iframe>
    </div>
  );
};

export default Loading;
