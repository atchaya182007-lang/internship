import ItemCard from "../components/ItemCard";

function Home({
  items,
  setPage,
}) {
  const recentItems = items.slice(0, 3);

  const lostCount = items.filter(
    (item) => item.status === "Lost"
  ).length;

  const foundCount = items.filter(
    (item) => item.status === "Found"
  ).length;

  const latestFoundItem = items.find(
    (item) => item.status === "Found"
  );

  return (
    <main>

      {/* HERO SECTION */}
      <section className="hero">

        <div className="hero-content">

          <div className="hero-badge">
            <span></span>
            Campus Lost & Found
          </div>

          <h1>
            Lost something?
            <br />
            <em>Let's find it.</em>
          </h1>

          <p>
            Search lost and found reports
            around your campus. Add clear
            locations, photos and details
            to make reconnecting easier.
          </p>

          <div className="hero-actions">

            <button
              className="primary-btn"
              onClick={() =>
                setPage("lostfound")
              }
            >
              Browse items
              <span>→</span>
            </button>

            <button
              className="ghost-btn"
              onClick={() =>
                setPage("report")
              }
            >
              Report an item
            </button>

          </div>

        </div>


        {/* CAMPUS ACTIVITY CARD */}
        <div className="hero-visual">

          <div className="activity-card">

            <div className="activity-label">
              <span>⌂</span>
              CAMPUS ACTIVITY
            </div>


            <div className="activity-count">

              <div className="activity-check">
                ✓
              </div>

              <strong>
                {foundCount}
              </strong>

              <span>
                found items
              </span>

            </div>


            <p className="activity-message">
              Good news! Items are being
              reported and returned across
              the campus.
            </p>


            {latestFoundItem && (
              <div className="activity-location">

                <div className="location-icon">
                  ⌖
                </div>

                <div>
                  <small>
                    Most recent found item
                  </small>

                  <strong>
                    {latestFoundItem.location}
                  </strong>
                </div>

                <span className="location-arrow">
                  →
                </span>

              </div>
            )}

          </div>

        </div>

      </section>


      {/* STATISTICS */}
      <section className="stats">

        <div className="stat-card">
          <strong>
            {items.length}
          </strong>

          <span>
            Total reports
          </span>
        </div>


        <div className="stat-card">
          <strong>
            {lostCount}
          </strong>

          <span>
            Lost items
          </span>
        </div>


        <div className="stat-card">
          <strong>
            {foundCount}
          </strong>

          <span>
            Found items
          </span>
        </div>

      </section>


      {/* RECENT ITEMS */}
      <section className="content-section">

        <div className="section-heading">

          <div>

            <span className="section-kicker">
              RECENT REPORTS
            </span>

            <h2>
              Latest items
            </h2>

          </div>


          <button
            className="section-link"
            onClick={() =>
              setPage("lostfound")
            }
          >
            View all →
          </button>

        </div>


        <div className="item-grid">

          {recentItems.map(
            (item) => (
              <ItemCard
                key={item.id}
                item={item}
              />
            )
          )}

        </div>

      </section>


      {/* HOW IT WORKS */}
      <section className="how-section">

        <div>

          <span className="section-kicker">
            HOW IT WORKS
          </span>

          <h2>
            Simple from start to finish.
          </h2>

        </div>


        <div className="steps">

          <div>

            <b>01</b>

            <h3>
              Report
            </h3>

            <p>
              Add the item name,
              location and photo.
            </p>

          </div>


          <div>

            <b>02</b>

            <h3>
              Search
            </h3>

            <p>
              Browse reports using
              simple filters.
            </p>

          </div>


          <div>

            <b>03</b>

            <h3>
              Reconnect
            </h3>

            <p>
              Help return the item
              to its owner.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Home;