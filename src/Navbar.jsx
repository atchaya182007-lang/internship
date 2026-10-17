function Navbar({
  page,
  setPage,
}) {
  return (
    <header className="navbar">

      <button
        className="brand"
        onClick={() =>
          setPage("home")
        }
      >
        <span className="brand-mark">
          LF
        </span>

        <span className="brand-text">
          <strong>Campus Find</strong>
          <small>Lost & Found</small>
        </span>
      </button>

      <nav className="nav-links">

        <button
          className={
            page === "home"
              ? "active"
              : ""
          }
          onClick={() =>
            setPage("home")
          }
        >
          Home
        </button>

        <button
          className={
            page === "lostfound"
              ? "active"
              : ""
          }
          onClick={() =>
            setPage("lostfound")
          }
        >
          Browse
        </button>

        <button
          className={
            page === "about"
              ? "active"
              : ""
          }
          onClick={() =>
            setPage("about")
          }
        >
          About
        </button>

      </nav>

      <button
        className="nav-report"
        onClick={() =>
          setPage("report")
        }
      >
        Report item
        <span>+</span>
      </button>

    </header>
  );
}

export default Navbar;