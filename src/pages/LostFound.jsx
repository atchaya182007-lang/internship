import {
  useMemo,
  useState,
} from "react";

import ItemCard from "../components/ItemCard";

function LostFound({
  items,
  setPage,
  user,
  markAsFound,
  deleteItem,
  isAdmin,
  supabase,
}) {

  const [filter, setFilter] =
    useState("All");

  const [query, setQuery] =
    useState("");

  const [selectedItem, setSelectedItem] =
    useState(null);

  const [showFoundForm, setShowFoundForm] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [finderData, setFinderData] =
    useState({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      foundLocation: "",
      details: "",
    });

  const filtered = useMemo(() => {

    const q =
      query.trim().toLowerCase();

    return items.filter((item) => {

      const typeMatch =
        filter === "All" ||
        (
          filter === "Found" &&
          item.status === "Found"
        ) ||
        (
          filter === "Lost" &&
          item.status !== "Found" &&
          item.type === "Lost"
        );

      const text =
        `${item.title} ${item.location} ${item.category}`
          .toLowerCase();

      return (
        typeMatch &&
        text.includes(q)
      );
    });

  }, [items, filter, query]);

  function openFoundForm(item) {

    setSelectedItem(item);

    setFinderData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      foundLocation: "",
      details: "",
    });

    setShowFoundForm(true);
  }

  async function submitFoundReport(event) {

    event.preventDefault();

    if (!selectedItem) return;

    setSubmitting(true);

    const { error } =
      await supabase
        .from("found_reports")
        .insert({
          item_id: selectedItem.id,
          finder_name:
            finderData.name,
          finder_email:
            finderData.email,
          finder_phone:
            finderData.phone,
          found_location:
            finderData.foundLocation,
          finder_details:
            finderData.details,
        });

 if (error) {
  console.error("FOUND REPORT ERROR:", error);

  alert(
    "Supabase Error:\n" +
    error.message +
    "\n\nDetails:\n" +
    (error.details || "None") +
    "\n\nHint:\n" +
    (error.hint || "None")
  );

  setSubmitting(false);
  return;
}

    const updated =
      await markAsFound(
        selectedItem.id
      );

    if (!updated) {
      setSubmitting(false);
      return;
    }

    setShowFoundForm(false);
    setSelectedItem(null);
    setSubmitting(false);

    alert(
      "Thank you. The item has been marked as found."
    );
  }

  return (
    <main className="browse-page">

      <section className="browse-heading">

        <div>

          <span className="section-kicker">
            ITEM DIRECTORY
          </span>

          <h1>
            Find a reported item.
          </h1>

          <p>
            Search by name, category or
            the place where it was lost or found.
          </p>

        </div>

        <button
          className="primary-btn"
          onClick={() =>
            setPage("report")
          }
        >
          Report item
          <span>↗</span>
        </button>

      </section>

      <section className="browse-tools">

        <div className="filter-group">

          {["All", "Lost", "Found"].map(
            (tab) => (

              <button
                key={tab}
                className={
                  filter === tab
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter(tab)
                }
              >
                {tab}

                {tab === "All" && (
                  <small>
                    {items.length}
                  </small>
                )}

              </button>

            )
          )}

        </div>

        <label className="search-field">

          <span>⌕</span>

          <input
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            placeholder="Search items or locations..."
          />

          {query && (
            <button
              type="button"
              onClick={() =>
                setQuery("")
              }
            >
              ×
            </button>
          )}

        </label>

      </section>

      <div className="results-info">

        <span>
          {filtered.length}{" "}
          {filtered.length === 1
            ? "report"
            : "reports"}
        </span>

        {query && (
          <span>
            for “{query}”
          </span>
        )}

      </div>

      {filtered.length ? (

        <div className="item-grid browse-grid">

          {filtered.map((item) => (

            <div
              className="browse-item-wrap"
              key={item.id}
            >

              <ItemCard
                item={item}
              />

              <div className="card-actions">

  <button
    onClick={() =>
      setSelectedItem(item)
    }
  >
    View details
    <span>→</span>
  </button>

  {item.status !== "Found" &&
    item.type === "Lost" && (
      <button
        className="found-action"
        onClick={() =>
          openFoundForm(item)
        }
      >
        I found this
        <span>✓</span>
      </button>
    )}

  {isAdmin && (
    <button
      className="delete-action"
      onClick={() =>
        deleteItem(item.id)
      }
    >
      Delete
      <span>×</span>
    </button>
  )}

</div>

            </div>

          ))}

        </div>

      ) : (

        <div className="empty-card large">

          <div className="empty-icon">
            ⌕
          </div>

          <h3>
            No matching reports
          </h3>

          <p>
            Try a different keyword,
            location or filter.
          </p>

          <button
            className="ghost-btn"
            onClick={() => {
              setQuery("");
              setFilter("All");
            }}
          >
            Clear filters
          </button>

        </div>

      )}

      {selectedItem &&
        !showFoundForm && (

          <div
            className="modal-backdrop"
            onMouseDown={(e) =>
              e.target === e.currentTarget &&
              setSelectedItem(null)
            }
          >

            <div className="detail-modal">

              <button
                className="modal-close"
                onClick={() =>
                  setSelectedItem(null)
                }
              >
                ×
              </button>

              <div className="modal-image">

                {selectedItem.image ? (

                  <img
                    src={
                      selectedItem.image
                    }
                    alt={
                      selectedItem.title
                    }
                  />

                ) : (

                  <div className="image-fallback">
                    {selectedItem.category?.charAt(
                      0
                    ) || "?"}
                  </div>

                )}

                <span
                  className={`status-pill ${
                    selectedItem.status ===
                    "Found"
                      ? "found"
                      : "lost"
                  }`}
                >
                  {selectedItem.status ===
                  "Found"
                    ? "Found"
                    : "Lost"}
                </span>

              </div>

              <div className="modal-content">

                <span className="section-kicker">
                  {selectedItem.category ||
                    "OTHER"}
                </span>

                <h2>
                  {selectedItem.title}
                </h2>

                <div className="detail-row">
                  <span>
                    Location
                  </span>

                  <strong>
                    ⌖{" "}
                    {selectedItem.location ||
                      "Not provided"}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>
                    Reported
                  </span>

                  <strong>
                    {selectedItem.date ||
                      "—"}
                  </strong>
                </div>

                {selectedItem.status ===
                  "Found" &&
                  selectedItem.foundReport && (

                    <div className="found-box">

                      <strong>
                        Item has been found
                      </strong>

                      <span>
                        Found at:{" "}
                        {
                          selectedItem
                            .foundReport
                            .found_location
                        }
                      </span>

                      <a
                        href={`mailto:${selectedItem.foundReport.finder_email}`}
                      >
                        ✉{" "}
                        {
                          selectedItem
                            .foundReport
                            .finder_email
                        }
                      </a>

                      <a
                        href={`tel:${selectedItem.foundReport.finder_phone}`}
                      >
                        ☎{" "}
                        {
                          selectedItem
                            .foundReport
                            .finder_phone
                        }
                      </a>

                    </div>

                  )}

                {selectedItem.status !==
                  "Found" &&
                  selectedItem.type ===
                    "Lost" && (

                    <button
                      className="primary-btn full"
                      onClick={() =>
                        openFoundForm(
                          selectedItem
                        )
                      }
                    >
                      I found this item
                      <span>✓</span>
                    </button>

                  )}

              </div>

            </div>

          </div>

        )}

      {showFoundForm &&
        selectedItem && (

          <div className="modal-backdrop">

            <div className="form-modal">

              <button
                className="modal-close"
                onClick={() =>
                  !submitting &&
                  setShowFoundForm(false)
                }
              >
                ×
              </button>

              <span className="section-kicker">
                FOUND AN ITEM
              </span>

              <h2>
                Help return{" "}
                <span>
                  {selectedItem.title}
                </span>
              </h2>

              <p className="modal-intro">
                Tell the reporter where you
                found it and how they can
                contact you.
              </p>

              <form
                onSubmit={
                  submitFoundReport
                }
              >

                <div className="two-fields">

                  <Field
                    label="Your name"
                    name="name"
                    value={
                      finderData.name
                    }
                    onChange={
                      setFinderData
                    }
                  />

                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    value={
                      finderData.email
                    }
                    onChange={
                      setFinderData
                    }
                  />

                </div>

                <div className="two-fields">

                  <Field
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={
                      finderData.phone
                    }
                    onChange={
                      setFinderData
                    }
                  />

                  <Field
                    label="Where did you find it?"
                    name="foundLocation"
                    value={
                      finderData.foundLocation
                    }
                    onChange={
                      setFinderData
                    }
                  />

                </div>

                <label className="form-field">

                  <span>
                    Additional details
                  </span>

                  <textarea
                    name="details"
                    value={
                      finderData.details
                    }
                    onChange={(e) =>
                      setFinderData({
                        ...finderData,
                        details:
                          e.target.value,
                      })
                    }
                    rows="4"
                    placeholder="Anything that may help identify the item..."
                  />

                </label>

                <button
                  className="primary-btn full"
                  disabled={
                    submitting
                  }
                >
                  {submitting
                    ? "Submitting..."
                    : "Mark item as found"}

                  <span>✓</span>
                </button>

              </form>

            </div>

          </div>

        )}

    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
}) {
  return (
    <label className="form-field">

      <span>{label}</span>

      <input
        name={name}
        type={type}
        value={value}
        onChange={(e) =>
          onChange(
            (current) => ({
              ...current,
              [name]:
                e.target.value,
            })
          )
        }
        required
      />

    </label>
  );
}

export default LostFound;